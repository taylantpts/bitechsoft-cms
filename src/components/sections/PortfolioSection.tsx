'use client'

import { cn } from '@/lib/utils'
import type { PortfolioCard } from '@/types/frontend'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

type PortfolioSectionProps = {
  items: PortfolioCard[]
}

export function PortfolioSection({ items }: PortfolioSectionProps) {
  return (
    <section id="portfolio" className="bg-neutral-950 px-6 pt-24 pb-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Portfolyo</h2>
          <p className="mt-3 text-neutral-400">Gerçek projeler, ölçülebilir sonuçlar</p>
        </motion.div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <article
                className={cn(
                  'group overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50',
                  'transition-transform duration-300 hover:scale-[1.02] hover:border-emerald-400/40',
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.baslik}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-neutral-600">
                      Görsel yok
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                    {item.kategori}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.baslik}</h3>
                  {item.canliLink && (
                    <a
                      href={item.canliLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-emerald-400"
                    >
                      Canlı site
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            </motion.li>
          ))}
        </ul>

        {items.length === 0 && (
          <p className="text-center text-neutral-500">
            Henüz proje eklenmedi. Payload admin panelinden portfolyo oluşturabilirsiniz.
          </p>
        )}
      </div>
    </section>
  )
}
