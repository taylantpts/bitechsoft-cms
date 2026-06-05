'use client';

import { useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';

// ─── Sabitler ─────────────────────────────────────────────────────────────────
const FRAME_COUNT = 240;

/**
 * Delta-time normalize LERP hızı.
 * Formül: alpha = 1 - exp(-LERP_SPEED * deltaSeconds)
 * 30 / 60 / 120 / 144 Hz'de aynı "yağ gibi kayma" hissi verir.
 */
const LERP_SPEED = 5.0;

// ─── Typewriter satırları ─────────────────────────────────────────────────────
const TERMINAL_LINES = [
  { text: '> BITECHSOFT Cloud Altyapısı Başlatılıyor...', delay: 0,    color: '#6ee7b7' },
  { text: '> Sunucu Sistemleri Kurulumu...  OK',          delay: 900,  color: '#86efac' },
  { text: '> IT Operasyon Otomasyonu...     AKTİF',       delay: 1900, color: '#86efac' },
  { text: '> Güvenlik Protokolleri...       DEVREDE',   delay: 2900, color: '#86efac' },
  { text: '> Full-Stack Yazılım Motoru...   ÇALIŞIYOR',   delay: 3900, color: '#34d399' },
];
const CHAR_INTERVAL_MS = 28; // daktilo hızı (ms/karakter)

// ─── Bileşen ──────────────────────────────────────────────────────────────────
export default function ScrollAnimation() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const terminalRef    = useRef<HTMLDivElement>(null);
  const linesRef       = useRef<HTMLDivElement>(null);   // typewriter satırları
  const cursorRef      = useRef<HTMLSpanElement>(null);  // yanıp sönen imleç
  const progressBarRef = useRef<HTMLDivElement>(null);
  const countRef       = useRef<HTMLSpanElement>(null);

  const imagesRef     = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrame      = useRef(0);
  const currentFrame     = useRef(0);
  const lastDrawnFrame   = useRef(-1);  // sadece frame değişince çiz → stutter yok
  const rafRef        = useRef<number | undefined>(undefined);
  const lastTimeRef   = useRef<number>(-1);
  const readyRef      = useRef(false);
  const visibleRef    = useRef(true);
  const reducedRef    = useRef(false);

  // Typewriter state (ref → sıfır re-render)
  const typedRef       = useRef(false);
  const typeTimersRef  = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Canvas 2d context ve son boyut — render içinde saklanır
  const ctxRef  = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ dpr: -1, w: -1, h: -1 });

  // ─── prefers-reduced-motion ─────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    const cb = (e: MediaQueryListEvent) => { reducedRef.current = e.matches; };
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
  }, []);

  // ─── Kareleri paralel yükle ──────────────────────────────────────────────────
  useEffect(() => {
    imagesRef.current = new Array(FRAME_COUNT).fill(null);
    let done = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
        i <= 10 ? 'high' : 'low';
      img.src = `/frames/server-to-laptop/kare (${i}).png`;

      img.onload = async () => {
        try { await img.decode(); } catch { /* atla */ }
        imagesRef.current[i - 1] = img;
        done++;
        const pct = Math.round((done / FRAME_COUNT) * 100);
        if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
        if (countRef.current)       countRef.current.textContent = `${pct}%`;

        if (done === FRAME_COUNT) {
          readyRef.current = true;
          const loader = document.getElementById('sa-loader');
          if (loader) {
            loader.style.transition = 'opacity 0.7s ease';
            loader.style.opacity    = '0';
            setTimeout(() => (loader.style.display = 'none'), 750);
          }
        }
      };
      img.onerror = () => { done++; };
    }
  }, []);

  // ─── IntersectionObserver — viewport dışında rAF durdur ──────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !rafRef.current) {
          lastTimeRef.current = -1;
          rafRef.current = requestAnimationFrame(renderFrame);
        }
      },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Resize debounce (150 ms) ─────────────────────────────────────────────────
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas || !ctxRef.current) return;
        const dpr = window.devicePixelRatio || 1;
        const w   = window.innerWidth;
        const h   = window.innerHeight;
        canvas.width  = w * dpr;
        canvas.height = h * dpr;
        ctxRef.current.scale(dpr, dpr);
        sizeRef.current = { dpr, w, h };
      }, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => { window.removeEventListener('resize', onResize); clearTimeout(timer); };
  }, []);

  // ─── Typewriter engine ───────────────────────────────────────────────────────
  function startTypewriter() {
    if (typedRef.current) return;
    typedRef.current = true;

    const container = linesRef.current;
    if (!container) return;
    container.innerHTML = ''; // temizle

    // imleç span'ını container dışında tut
    const cursor = cursorRef.current;

    TERMINAL_LINES.forEach((line, lineIdx) => {
      const p = document.createElement('p');
      p.className = 'terminal-line';
      p.style.color = lineIdx < TERMINAL_LINES.length - 1 ? '#9ca3af' : '#34d399';
      p.style.margin = '0';
      p.style.lineHeight = '1.6';
      p.style.minHeight = '1.4em';
      container.appendChild(p);

      const t = setTimeout(() => {
        let charIdx = 0;
        const type = () => {
          if (charIdx < line.text.length) {
            p.textContent = line.text.slice(0, charIdx + 1);
            charIdx++;
            const tt = setTimeout(type, CHAR_INTERVAL_MS);
            typeTimersRef.current.push(tt);
          } else {
            // Bu satır bitti — imleci bir sonraki satıra taşı
            if (lineIdx === TERMINAL_LINES.length - 1 && cursor) {
              // Son satır → imleci son satırın arkasına ekle
              p.appendChild(cursor);
            }
          }
        };
        type();
      }, line.delay);

      typeTimersRef.current.push(t);
    });
  }

  function resetTypewriter() {
    typedRef.current = false;
    typeTimersRef.current.forEach(clearTimeout);
    typeTimersRef.current = [];
    if (linesRef.current) linesRef.current.innerHTML = '';
  }

  // ─── Terminal görünürlük kontrolü — SADECE opacity, sıfır konum değişimi ──
  function applyTerminalPosition(progress: number) {
    const el = terminalRef.current;
    if (!el) return;

    const isVisible = progress > 0.88;
    el.style.opacity = isVisible ? '1' : '0';

    // Typewriter: görünür olduğunda başlat, gizlendiğinde sıfırla
    if (isVisible) {
      startTypewriter();
    } else {
      resetTypewriter();
    }
  }

  // ─── Lenis scroll → targetFrame ──────────────────────────────────────────────
  useLenis(() => {
    if (!containerRef.current || !readyRef.current) return;
    const { top, height } = containerRef.current.getBoundingClientRect();
    const winH = window.innerHeight;
    let progress = -top / (height - winH);
    progress = Math.max(0, Math.min(1, progress));
    targetFrame.current = progress * (FRAME_COUNT - 1);
    applyTerminalPosition(progress);
  });

  // ─── Canvas render döngüsü ────────────────────────────────────────────────────
  function renderFrame(timestamp: number) {
    if (!visibleRef.current) { rafRef.current = undefined; return; }
    rafRef.current = requestAnimationFrame(renderFrame);

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext('2d', { alpha: false });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Delta-time
    if (lastTimeRef.current < 0) lastTimeRef.current = timestamp;
    const dt = Math.min(timestamp - lastTimeRef.current, 64) / 1000;
    lastTimeRef.current = timestamp;

    // Delta-time normalize LERP
    const speed = reducedRef.current ? 999 : LERP_SPEED;
    const alpha = 1 - Math.exp(-speed * dt);
    const diff  = targetFrame.current - currentFrame.current;

    // ── DÜZELTME 3: Deadzone 0.2 ─────────────────────────────────────────────
    // Yavaş scroll'da diff küçük kalır ve iki tam frame arasında
    // sürekli gidip gelir → titreme. 0.2 eşiği altında direkt hedefe kilitle.
    currentFrame.current =
      Math.abs(diff) < 0.2 ? targetFrame.current : currentFrame.current + diff * alpha;

    const frameIdx = Math.round(currentFrame.current);

    // ── Micro-stutter önlemi: frame değişmediyse çizme ───────────────────────
    // Yavaş scroll'da ondalıklı sayılar aynı tam frame'e round'lanır;
    // gereksiz clearRect + drawImage çağrısı titreme yaratır.
    if (frameIdx === lastDrawnFrame.current) {
      return; // Bu frame'i zaten çizdik, atla
    }
    lastDrawnFrame.current = frameIdx;

    const img = imagesRef.current[frameIdx];
    if (!img?.complete || img.naturalWidth === 0) return;

    // Resize guard
    const dpr  = window.devicePixelRatio || 1;
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;
    const s    = sizeRef.current;
    if (dpr !== s.dpr || cssW !== s.w || cssH !== s.h) {
      canvas.width  = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.scale(dpr, dpr);
      sizeRef.current = { dpr, w: cssW, h: cssH };
      lastDrawnFrame.current = -1; // resize sonrası yeniden çiz
    }

    // ── DÜZELTME 1: Math.min → "contain" modu ────────────────────────────────
    // Tüm görüntü ekrana sığar, hiçbir kenar (özellikle üst) kırpılmaz.
    // Math.max (cover) kullanmak laptopun üstünü ekrandan taşırıyordu.
    const scale = Math.min(cssW / img.naturalWidth, cssH / img.naturalHeight);
    const drawW = img.naturalWidth  * scale;
    const drawH = img.naturalHeight * scale;
    // Yatay ve dikey olarak tam merkeze hizala
    const ox    = Math.round((cssW - drawW) / 2);
    const oy    = Math.round((cssH - drawH) / 2);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.drawImage(img, ox, oy, drawW, drawH);
  }

  // ─── İlk rAF başlatma ────────────────────────────────────────────────────────
  useEffect(() => {
    visibleRef.current  = true;
    lastTimeRef.current = -1;
    rafRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      typeTimersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── JSX ──────────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* Loading */}
        <div
          id="sa-loader"
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
            <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V6a3 3 0 013-3h13.5a3 3 0 013 3v5.25a3 3 0 01-3 3m-13.5 0v3.75m13.5-3.75v3.75m-13.5 0h13.5"
              />
            </svg>
          </div>
          <p className="mb-1 font-mono text-xs font-medium uppercase tracking-[0.25em] text-emerald-400">BITECHSOFT</p>
          <p className="mb-6 font-mono text-xs text-neutral-500">Sistem Görselleştirmesi Yükleniyor</p>
          <div className="relative h-px w-48 overflow-hidden rounded-full bg-neutral-800">
            <div ref={progressBarRef} className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-emerald-600 to-emerald-300 transition-[width] duration-75" />
          </div>
          <span ref={countRef} className="mt-3 font-mono text-xs tabular-nums text-neutral-600">0%</span>
        </div>

        {/* GPU Canvas */}
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" style={{ willChange: 'contents' }} />

        {/* Vignette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.82) 100%)' }} />

        {/* Film Grain */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-[0.07] mix-blend-overlay">
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>

        {/* ── DÜZELTME 2: Terminal — ekran merkezi, SADECE opacity animasyonu ── */}
        {/* X/Y kayma yok. Kutu her zaman absolute inset-0 merkezde durur.      */}
        {/* Scroll %90'ı geçince opacity 0→1 ile belirir, typewriter başlar.    */}
        <div
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          style={{ opacity: 0, transition: 'opacity 0.7s ease' }}
          ref={(el) => {
            // terminalRef'i wrapper'ın kendisine bağla (opacity kontrolü burada)
            (terminalRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
        >
          <div
            className="rounded-xl border p-5 backdrop-blur-md"
            style={{
              width:       'min(420px, 80vw)',
              background:  'rgba(0, 0, 0, 0.60)',
              borderColor: 'rgba(52, 211, 153, 0.20)',
              boxShadow:   '0 0 0 1px rgba(52,211,153,0.12), 0 0 60px rgba(16,185,129,0.10), 0 16px 48px rgba(0,0,0,0.7)',
            }}
          >
          {/* macOS traffic lights */}
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500/70" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
            <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
            <span className="ml-2 font-mono text-[10px] text-neutral-500">bitechsoft ~ cloud</span>
          </div>

          {/* Typewriter satırları — JS engine tarafından doldurulur */}
          <div ref={linesRef} className="font-mono text-xs leading-relaxed text-neutral-400" />

          {/* Yanıp sönen imleç — JS tarafından son satıra taşınır */}
          <span
            ref={cursorRef}
            className="inline-block h-[0.85em] w-[0.5em] translate-y-[1px] bg-emerald-400"
            style={{ animation: 'blink 1s step-end infinite' }}
          />

          <style>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
            .terminal-line {
              font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
              font-size: 0.75rem;
              line-height: 1.6;
            }
          `}</style>
          </div>  {/* glassmorphism kutu */}
        </div>  {/* inset-0 wrapper */}

      </div>
    </div>
  );
}