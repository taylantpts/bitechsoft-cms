'use client'

import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

type SmoothScrollProps = {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        // ScrollAnimation LERP_SPEED:4.5 ile katmanlı çalışır → buttery smooth
        lerp: 0.075,
        smoothWheel: true,
        // Masaüstü tekerlek hızı
        wheelMultiplier: 1.0,
        // Mobil parmak kaydırmasını masaüstüyle dengeler
        touchMultiplier: 1.2,
        // iOS / Android'de Lenis yumuşatması aktif
        syncTouch: true,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
