import { RenderBlocks } from '@/components/RenderBlocks'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { notFound } from 'next/navigation'

export const revalidate = 3600

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadHMR({ config })
    const { docs } = await payload.find({
      collection: 'pages',
      pagination: false,
      depth: 0,
      select: { slug: true },
      overrideAccess: false,
    })
    return docs.map((page) => ({ slug: page.slug }))
  } catch {
    return []
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadHMR({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
    overrideAccess: false,
  })

  const page = docs[0]
  if (!page) notFound()

  return (
    <main className="pt-20">
      <RenderBlocks layout={page.layout} />
    </main>
  )
}
