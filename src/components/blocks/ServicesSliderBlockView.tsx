'use client'

import { getMediaUrl } from '@/lib/media-url'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'

type ServiceItem = {
  id: number
  baslik: string
  ikon: string
  aciklama: string
  image?: { url?: string | null } | string | number | null
}

type ServicesSliderBlockViewProps = {
  title: string
  services?: ServiceItem[] | null
}

function resolveIcon(name: string): LucideIcon {
  const key = name.trim()
  const icons = LucideIcons as unknown as Record<string, LucideIcon | undefined>
  if (icons[key]) return icons[key]
  const pascalKey = key
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return icons[pascalKey] ?? Sparkles
}

export function ServicesSliderBlockView({ title, services }: ServicesSliderBlockViewProps) {
  const items = (services ?? []).filter(
    (s): s is ServiceItem => typeof s === 'object' && s !== null && 'baslik' in s,
  )

  return (
    <section className="bg-neutral-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {items.map((service, index) => {
            const Icon = resolveIcon(service.ikon)
            const imageUrl = getMediaUrl(service.image)
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className={cn(
                  'min-w-[280px] shrink-0 snap-start rounded-2xl bg-white/5 p-6 backdrop-blur sm:min-w-[320px]',
                )}
              >
                {imageUrl ? (
                  <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                    <Image src={imageUrl} alt={service.baslik} fill className="object-cover" />
                  </div>
                ) : (
                  <Icon className="mb-4 h-8 w-8 text-emerald-400" />
                )}
                <h3 className="text-xl font-semibold text-white">{service.baslik}</h3>
                <p className="mt-3 text-sm text-neutral-400">{service.aciklama}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
