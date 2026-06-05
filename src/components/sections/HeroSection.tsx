'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * HeroSection — Scroll-linked fade-out + "sticky overlay" mimarisi
 *
 * sticky top-0 → Canvas animasyonu HeroSection'ın arkasında zaten hazır.
 * Kullanıcı kaydırdıkça hero opacity 1→0, y 0→-48px ile erir.
 * Canvas bir anda "başlamaz" — her zaman orada, altında bekler.
 * Kopukluk hissi tamamen ortadan kalkar.
 */
export function HeroSection() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Kaydırdıkça hero erir ve yukarı kayar
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const y       = useTransform(scrollYProgress, [0, 0.6], [0, -48])
  const scale   = useTransform(scrollYProgress, [0, 0.6], [1, 0.97])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6 pt-20"
    >
      {/* Arka plan ışığı */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.12)_0%,_transparent_55%)]"
      />

      {/* Scroll'a bağlı içerik wrapper */}
      <motion.div style={{ opacity, y, scale }} className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Mount-time giriş animasyonu (yalnızca bir kez) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
            Bıtechsoft
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Dijital Dönüşümün{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              Merkezi
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400"
          >
            Akıcı deneyimler, neon vurgular ve sıfır yavaşlık odaklı teknoloji çözümleri.
          </motion.p>
        </motion.div>

        {/* Scroll ipucu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <div className="flex flex-col items-center gap-1 text-neutral-600">
            <span className="font-mono text-[10px] uppercase tracking-widest">Kaydır</span>
            <svg
              className="h-4 w-4 animate-bounce"
              fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
