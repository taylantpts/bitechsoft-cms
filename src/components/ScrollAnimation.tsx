'use client';
import React, { useEffect, useRef, useState } from 'react';

// Toplam resim sayısı
const FRAME_COUNT = 240; 

export default function ScrollAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(0);
  const [showTerminal, setShowTerminal] = useState(false);
  
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrame = useRef(0);
  const currentFrame = useRef(0);
  const requestRef = useRef<number>();

  // 1. AŞAMA: RESİMLERİ RAM'E PARALEL VE TERS SIRAYLA (SUNUCUDAN LAPTOPA) YÜKLEME
  useEffect(() => {
    // Array'i baştan boyutlandırıyoruz
    imagesRef.current = new Array(FRAME_COUNT);
    let loadedCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/server-to-laptop/kare (${i}).png`;
      
      img.onload = async () => {
        try {
          await img.decode(); // Ekran kartında (GPU) çöz
        } catch (e) {
          console.warn(`Resim çözülemedi: ${img.src}`);
        }
        
        // GÖRSELLERİ TERSİNE ÇEVİRME: Sunucudan başlayıp laptopa dönüşmesi için
        // i=1 (laptop) en sona, i=240 (sunucu) en başa yerleşir.
        const reversedIndex = FRAME_COUNT - i;
        imagesRef.current[reversedIndex] = img;
        
        loadedCount++;
        setLoaded(loadedCount);
      };

      img.onerror = () => {
        loadedCount++;
        setLoaded(loadedCount);
      };
    }
  }, []);

  // 2. AŞAMA: SCROLL YAKALAMA VE LERP YUMUŞATMA
  useEffect(() => {
    if (loaded < FRAME_COUNT) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      let progress = -top / (height - windowHeight);
      progress = Math.max(0, Math.min(1, progress));

      // Scroll yönü normale döndü (0'dan başlayıp 239'a gidecek)
      targetFrame.current = progress * (FRAME_COUNT - 1);
      setShowTerminal(progress > 0.85);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const render = () => {
      // 0.75 LERP ile farenin hızına anında, pürüzsüz tepki verir
      currentFrame.current += (targetFrame.current - currentFrame.current) * 0.75;

      const frameIndex = Math.floor(currentFrame.current);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (canvas && ctx && imagesRef.current[frameIndex]) {
        const img = imagesRef.current[frameIndex];
        
        // GÜVENLİK KİLİDİ: Resim bozuksa veya yüklenmediyse çizmeyi atla, çökme!
        if (!img.complete || img.naturalWidth === 0) {
          requestRef.current = requestAnimationFrame(render);
          return; 
        }
        
        // Retina Ekran (High-DPI) Keskinleştirme
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== window.innerWidth * dpr) {
          canvas.width = window.innerWidth * dpr;
          canvas.height = window.innerHeight * dpr;
          ctx.scale(dpr, dpr);
        }

        // Görüntü Kalitesi İçin Math.min (Resmi kırpmadan orijinal netliğinde sığdırır)
        const scale = Math.min(window.innerWidth / img.naturalWidth, window.innerHeight / img.naturalHeight);
        const x = (window.innerWidth / 2) - (img.naturalWidth / 2) * scale;
        const y = (window.innerHeight / 2) - (img.naturalHeight / 2) * scale;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loaded]);

  return (
    // 150vh ile scroll pistini kısalttık, animasyon akıcı ve sıkıcı olmadan bitecek
    <div ref={containerRef} className="relative h-[150vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Yükleme Ekranı */}
        {loaded < FRAME_COUNT && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-emerald-500 font-mono">
            <p>BITECHSOFT Core Yükleniyor...</p>
            <p className="mt-2 text-2xl">{Math.round((loaded / FRAME_COUNT) * 100)}%</p>
          </div>
        )}
        
        {/* GPU Hızlandırmalı Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full" 
          style={{ transform: 'translateZ(0)' }} 
        />

        {/* Sinematik Gren (Noise) ve Vignette Filtresi */}
        <svg className="pointer-events-none absolute inset-0 z-10 w-full h-full opacity-[0.15] mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)]"></div>

        {/* Bitechsoft Terminal Ekranı */}
        <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${showTerminal ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-emerald-500 font-mono text-xl sm:text-2xl text-left bg-black/50 p-8 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <p className="mb-2">{">"} BITECHSOFT Cloud Altyapısı Başlatılıyor...</p>
            <p className="mb-2 text-emerald-400">{">"} Sunucu Sistemleri Kurulumu... <span className="text-green-300">OK</span></p>
            <p className="mb-2 text-emerald-400">{">"} IT Operasyon Otomasyonu... <span className="text-green-300">AKTİF</span></p>
            <p className="mb-2 text-emerald-400">{">"} Sistem Güvenlik Protokolleri... <span className="text-green-300">DEVREDE</span></p>
            <p className="mt-4 font-bold animate-pulse text-emerald-300">{">"} Full-Stack Yazılım Geliştirme Motoru... ÇALIŞIYOR</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}