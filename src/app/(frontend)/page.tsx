import ScrollAnimation from '@/components/ScrollAnimation'
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
        depth: 1,           // image alanını populate et
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
      imageUrl: getMediaUrl(service.image),
      popupDetay: service.popupDetay
        ? {
            kisaOzet:      service.popupDetay.kisaOzet      ?? null,
            ozellikler:    service.popupDetay.ozellikler    ?? null,
            istatistik:    service.popupDetay.istatistik    ?? null,
            istatistikAlt: service.popupDetay.istatistikAlt ?? null,
          }
        : null,
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
      {/*
        "Sticky Overlay" mimarisi:
        HeroSection normal akışta, ScrollAnimation -mt-screen ile
        bir ekran yüksekliği geriye çekilerek HeroSection'ın arkasında başlar.
        Hero erirken canvas pürüzsüzce görünür — Apple / Vercel geçiş hissi.
      */}
      <HeroSection />
      <div className="-mt-[100vh]">
        <ScrollAnimation />
      </div>
      
      {databaseUnavailable && (
        <section className="bg-neutral-950 px-6 py-16 text-center">
          <p className="mx-auto max-w-xl text-lg text-neutral-400">
            İçerikler Yükleniyor veya Veritabanı Bekleniyor
          </p>
        </section>
      )}
      <ServicesSection services={serviceCards} />
      <PortfolioSection items={portfolioCards} />
    </>
  )
}