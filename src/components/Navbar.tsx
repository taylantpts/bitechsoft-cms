'use client'

import type { NavLink } from '@/types/frontend'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type NavbarProps = {
  navItems?: NavLink[] | null
}

export default function Navbar({ navItems }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const defaultItems = [
    { label: 'Ana Sayfa', url: '/' },
    { label: 'Hakkımızda', url: '#hakkimizda' },
    { label: 'Hizmetlerimiz', url: '#hizmetlerimiz' }
  ]
  const items = navItems && navItems.length > 0 ? navItems : defaultItems

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 transition-all duration-300"
      aria-label="Ana menü"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Görseli */}
        <Link href="/" aria-label="Bitechsoft Ana Sayfa">
          <Image
            src="/bitechlogo.webp"
            alt="Bitechsoft"
            width={160}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Masaüstü Menü */}
        <div className="hidden md:flex gap-8 items-center">
          {items.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              className="text-neutral-300 hover:text-emerald-500 transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/iletisim"
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all"
          >
            Bize Ulaşın
          </Link>
        </div>

        {/* Mobil Hamburger Butonu */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-md text-neutral-300 hover:text-white transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {/* Hamburger çizgileri — open durumunda X'e dönüşür */}
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* Mobil Açılır Menü */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md"
        >
          <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {items.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-emerald-400 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/iletisim"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg px-4 py-3 text-center text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-black transition-colors"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}