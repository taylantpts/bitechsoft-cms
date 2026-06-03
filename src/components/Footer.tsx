import type { FooterData } from '@/types/frontend'
import Link from 'next/link'

type FooterProps = {
  data?: FooterData | null
}

export function Footer({ data }: FooterProps) {
  if (!data) return null

  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        {data.columns?.map((column) => (
          <div key={column.id ?? column.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              {column.title}
            </h3>
            <ul className="space-y-2">
              {column.links?.map((link) => (
                <li key={link.id ?? `${link.label}-${link.url}`}>
                  <Link
                    href={link.url}
                    className="text-sm text-neutral-400 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
        <p className="text-sm text-neutral-500">{data.copyright}</p>
        <ul className="flex flex-wrap gap-4">
          {data.socialLinks?.map((link) => (
            <li key={link.id ?? `${link.label}-${link.url}`}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-400 transition-colors hover:text-emerald-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
