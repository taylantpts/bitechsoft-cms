'use client'

import type { ServiceCard } from '@/types/frontend'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Sparkles } from 'lucide-react'

type ServicesSectionProps = {
  services: ServiceCard[]
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

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="bg-neutral-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Hizmetlerimiz</h2>
          <p className="mt-3 text-neutral-400">Uçtan uca dijital dönüşüm yetkinlikleri</p>
        </motion.div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = resolveIcon(service.ikon)
            return (
              <motion.li
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <article
                  className={cn(
                    'group h-full rounded-2xl border border-white/10 bg-neutral-900/50 p-6',
                    'transition-transform duration-300 hover:scale-[1.03] hover:border-emerald-400/40',
                  )}
                >
                  <Icon className="mb-4 h-8 w-8 text-emerald-400 transition-colors group-hover:text-emerald-300" />
                  <h3 className="text-xl font-semibold text-white">{service.baslik}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">{service.aciklama}</p>
                </article>
              </motion.li>
            )
          })}
        </ul>

        {services.length === 0 && (
          <p className="text-center text-neutral-500">
            Henüz hizmet eklenmedi. Payload admin panelinden içerik ekleyebilirsiniz.
          </p>
        )}
      </div>
    </section>
  )
}
