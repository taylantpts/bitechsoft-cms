import { HeroSection } from '@/components/sections/HeroSection'
import { PortfolioSection } from '@/components/sections/PortfolioSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { getMediaUrl } from '@/lib/media-url'
import type { PortfolioCard, ServiceCard } from '@/types/frontend'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

export const revalidate = 3600

export default async function HomePage() {
  let serviceCards: ServiceCard[] = []
  let portfolioCards: PortfolioCard[] = []
  let databaseUnavailable = false

  try {
    const payload = await getPayloadHMR({ config })

    const [{ docs: services }, { docs: portfolioDocs }] = await Promise.all([
      payload.find({
        collection: 'services',
        pagination: false,
        sort: 'createdAt',
        overrideAccess: false,
      }),
      payload.find({
        collection: 'portfolio',
        pagination: false,
        depth: 1,
        sort: '-createdAt',
        overrideAccess: false,
      }),
    ])

    serviceCards = services.map((service) => ({
      id: service.id,
      baslik: service.baslik,
      ikon: service.ikon,
      aciklama: service.aciklama,
    }))

    portfolioCards = portfolioDocs.map((item) => ({
      id: item.id,
      baslik: item.baslik,
      kategori: item.kategori,
      canliLink: item.canliLink,
      imageUrl: getMediaUrl(item.gorsel),
    }))
  } catch {
    databaseUnavailable = true
  }

  return (
    <>
      <HeroSection />
      {databaseUnavailable ? (
        <section className="bg-neutral-950 px-6 py-16 text-center">
          <p className="mx-auto max-w-xl text-lg text-neutral-400">
            İçerikler Yükleniyor veya Veritabanı Bekleniyor
          </p>
        </section>
      ) : null}
      <ServicesSection services={serviceCards} />
      <PortfolioSection items={portfolioCards} />
    </>
  )
}
