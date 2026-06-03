'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Sparkles } from 'lucide-react'

type FeatureCard = {
  icon: string
  title: string
  description: string
  id?: string | null
}

type FeaturesBlockViewProps = {
  title: string
  subtitle?: string | null
  cards?: FeatureCard[] | null
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

export function FeaturesBlockView({ title, subtitle, cards }: FeaturesBlockViewProps) {
  const items = cards ?? []

  return (
    <section className="bg-neutral-950 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          {subtitle ? <p className="mt-3 text-neutral-400">{subtitle}</p> : null}
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((card, index) => {
            const Icon = resolveIcon(card.icon)
            return (
              <motion.li
                key={card.id ?? index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <article
                  className={cn(
                    'h-full rounded-2xl bg-white/5 p-6 backdrop-blur',
                    'transition-all duration-300 hover:-translate-y-2',
                    'hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]',
                  )}
                >
                  <Icon className="mb-4 h-8 w-8 text-emerald-400" />
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-400">{card.description}</p>
                </article>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
