import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { SmoothScroll } from '@/components/SmoothScroll'
import type { FooterData, HeaderData } from '@/types/frontend'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import type { Metadata } from 'next'
import React from 'react'

import '../globals.css'

export const metadata: Metadata = {
  title: 'Bitechsoft | Dijital Dönüşümün Merkezi',
  description:
    'Bitechsoft — Akıcı, karanlık temalı teknoloji ajansı. Dijital dönüşüm, yazılım ve inovasyon.',
}

async function getSiteGlobals(): Promise<{
  header: HeaderData | null
  footer: FooterData | null
}> {
  try {
    const payload = await getPayloadHMR({ config })
    const [header, footer] = await Promise.all([
      payload.findGlobal({ slug: 'header', depth: 0, overrideAccess: false }),
      payload.findGlobal({ slug: 'footer', depth: 0, overrideAccess: false }),
    ])
    return {
      header: { navLinks: header.navLinks ?? null },
      footer: {
        copyright: footer.copyright,
        socialLinks: footer.socialLinks ?? null,
        columns: footer.columns ?? null,
      },
    }
  } catch {
    return { header: null, footer: null }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { header, footer } = await getSiteGlobals()

  return (
    <html lang="tr">
      <body className="min-h-screen bg-neutral-950">
        <SmoothScroll>
          <Navbar data={header} />
          {children}
          <Footer data={footer} />
        </SmoothScroll>
      </body>
    </html>
  )
}
