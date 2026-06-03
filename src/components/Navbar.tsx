import type { HeaderData } from '@/types/frontend'
import Link from 'next/link'

const fallbackLinks = [
  { label: 'Ana Sayfa', url: '/' },
  { label: 'Hizmetlerimiz', url: '/#services' },
  { label: 'İletişim', url: '/#iletisim' },
]

type NavbarProps = {
  data?: HeaderData | null
}

export function Navbar({ data }: NavbarProps) {
  const menuLinks = data?.navLinks?.length ? data.navLinks : fallbackLinks

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-neutral-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4">
        <div className="flex shrink-0 items-center">
          <Link
            href="/"
            className="text-lg font-semibold tracking-wide text-white transition-colors hover:text-emerald-400"
          >
            BITECH
          </Link>
        </div>

        <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {menuLinks.map((link) => (
            <li key={link.id ?? link.url}>
              <Link
                href={link.url}
                className="text-sm text-neutral-300 transition-colors hover:text-emerald-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
