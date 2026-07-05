'use client'

import type { ServiceCard, ServicePopupDetay } from '@/types/frontend'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import {
  Activity, Bot, Check, Cloud, Code, Database, Globe, Lock,
  Monitor, Network, Rocket, Server, Settings, Shield,
  Sparkles, Terminal, Wifi, X, Zap,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const ICON_MAP: Record<string, React.ElementType> = {
  Activity, Bot, Cloud, Code, Database, Globe, Lock,
  Monitor, Network, Rocket, Server, Settings, Shield,
  Sparkles, Terminal, Wifi, Zap,
}

function resolveIcon(name: string): React.ElementType {
  if (!name) return Sparkles
  const key = name.trim()
  if (ICON_MAP[key]) return ICON_MAP[key]!
  const pascal = key
    .replace(/[-_\s]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^./, (c: string) => c.toUpperCase())
  return ICON_MAP[pascal] ?? Sparkles
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function ServiceModal({ service, onClose }: { service: ServiceCard; onClose: () => void }) {
  const Icon     = resolveIcon(service.ikon)
  const popup    = service.popupDetay
  const hasExt   = popup && (popup.kisaOzet || popup.ozellikler?.length || popup.istatistik)
  const image    = service.imageUrl
  const imageUrl = typeof image === 'string' ? image : image?.url

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 24 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28, mass: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
      >
        <div className="relative h-52 w-full overflow-hidden bg-neutral-800">
          {imageUrl ? (
            <Image src={imageUrl} alt={service.baslik} fill className="object-cover" sizes="600px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900/40 via-neutral-800 to-neutral-900">
              <Icon className="h-24 w-24 text-emerald-400/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
          <div className="absolute bottom-5 left-6 right-14 flex items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{service.baslik}</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-neutral-300 leading-relaxed">{popup?.kisaOzet || service.aciklama}</p>

          {popup?.ozellikler && popup.ozellikler.length > 0 && (
            <div>
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-400">Neler Sunuyoruz</p>
              <ul className="space-y-2">
                {popup.ozellikler.map((o, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.055 }} className="flex items-start gap-2.5 text-sm text-neutral-400">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span>{o.madde}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {popup?.istatistik && (
            <div className="flex items-end gap-3 rounded-2xl border border-emerald-500/15 bg-emerald-500/6 px-5 py-4">
              <span className="text-3xl font-bold text-emerald-400 leading-none tabular-nums">{popup.istatistik}</span>
              {popup.istatistikAlt && <span className="mb-0.5 text-xs leading-snug text-neutral-500 max-w-[160px]">{popup.istatistikAlt}</span>}
            </div>
          )}

          {!hasExt && <p className="text-xs text-neutral-600 italic">Detay bilgisi admin panelden eklenebilir.</p>}
        </div>

        <button type="button" onClick={onClose} aria-label="Kapat" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-400 backdrop-blur-sm transition hover:bg-neutral-700 hover:text-white">
          <X className="h-[18px] w-[18px]" />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── KART ────────────────────────────────────────────────────────────────────
function ServiceCard({ service, index, onOpen }: { service: ServiceCard; index: number; onOpen: () => void }) {
  const Icon     = resolveIcon(service.ikon)
  const image    = service.imageUrl
  const imageUrl = typeof image === 'string' ? image : image?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}
      onClick={onOpen} role="button" aria-haspopup="dialog"
      className="flex-shrink-0 w-[260px] sm:w-[280px] cursor-pointer select-none"
    >
      <div className="group h-full rounded-2xl border border-white/8 bg-neutral-900 p-5 transition-colors duration-300 hover:border-emerald-500/30 hover:bg-neutral-800/60">
        {imageUrl && (
          <div className="mb-4 h-32 w-full overflow-hidden rounded-xl bg-neutral-800">
            <Image src={imageUrl} alt={service.baslik} width={280} height={128} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10">
          <Icon className="h-5 w-5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white leading-snug">{service.baslik}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 line-clamp-3">{service.aciklama}</p>
        <p className="mt-4 flex items-center gap-1 text-[11px] font-medium text-emerald-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Detayları gör
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </p>
      </div>
    </motion.div>
  )
}

// ─── DRAG CAROUSEL ───────────────────────────────────────────────────────────
function ServiceCarousel({ services, onOpen }: { services: ServiceCard[]; onOpen: (s: ServiceCard) => void }) {
  const constraintsRef = useRef<HTMLDivElement>(null)

  if (services.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10">
        <p className="text-sm text-neutral-500">Payload admin panelinden hizmet ekleyin.</p>
      </div>
    )
  }

  return (
    <div ref={constraintsRef} className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-neutral-950 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-neutral-950 to-transparent" />
      <motion.div
        drag="x" dragConstraints={constraintsRef} dragElastic={0.08}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 30 }}
        className="flex gap-4 px-4 py-8 cursor-grab active:cursor-grabbing"
        style={{ width: 'max-content' }}
        onClick={(e) => { if ((e as any).movementX !== 0) e.preventDefault() }}
      >
        {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} onOpen={() => onOpen(s)} />)}
        <div className="flex-shrink-0 w-8" aria-hidden />
      </motion.div>
      <p className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] text-neutral-700">
        <span>←</span> sürükle <span>→</span>
      </p>
    </div>
  )
}

// ─── ANA BÖLÜM ───────────────────────────────────────────────────────────────
export function ServicesSection({ services }: { services: ServiceCard[] }) {
  const [activeService, setActiveService] = useState<ServiceCard | null>(null)

  // Adım 1: Sadece görünürlük state'i + motion değerleri
  const [isHovered, setIsHovered] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  // GPU hızlandırmalı spring — re-render yok, sıfır lag
  const springX = useSpring(cursorX, { stiffness: 300, damping: 28, mass: 0.5 })
  const springY = useSpring(cursorY, { stiffness: 300, damping: 28, mass: 0.5 })

  return (
    <>
      <AnimatePresence>
        {activeService && (
          <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
        )}
      </AnimatePresence>

      <section id="hizmetlerimiz" className="relative bg-neutral-950 py-28 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.06)_0%,transparent_70%)]" />

        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 text-center"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-emerald-400">Ne Yapıyoruz</p>
            <h2 className="text-3xl font-bold text-white sm:text-5xl">Hizmetlerimiz</h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-400">Uçtan uca dijital dönüşüm yetkinlikleri — kurumsal altyapıdan yazılıma.</p>
          </motion.div>

          <ServiceCarousel services={services} onOpen={setActiveService} />

          {/* Adım 2: Zone — onMouseEnter ilk koordinatı anında set eder (uçarak gelmez) */}
          <div
            className="relative flex items-center justify-center py-20"
            aria-label="Bize ulaşın bölümü"
            onMouseEnter={(e) => {
              cursorX.set(e.clientX)
              cursorY.set(e.clientY)
              setIsHovered(true)
            }}
            onMouseMove={(e) => {
              cursorX.set(e.clientX)
              cursorY.set(e.clientY)
            }}
            onMouseLeave={() => setIsHovered(false)}
          />
        </div>
      </section>

      {/* Adım 3: Birebir şablon — translateX/Y -50% CSS merkezleme, JS math yok */}
      <motion.a
        href="/iletisim"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
        }}
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: isHovered ? 'auto' : 'none',
        }}
        whileTap={{ scale: 0.9 }}
        className="inline-flex items-center gap-2.5 rounded-full bg-emerald-400 px-7 py-3.5 text-sm font-semibold text-black whitespace-nowrap shadow-[0_0_44px_rgba(52,211,153,0.5)]"
      >
        <span>Bize Ulaşın</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </motion.a>
    </>
  )
}
