import { FeaturesBlockView } from '@/components/blocks/FeaturesBlockView'
import { ServicesSliderBlockView } from '@/components/blocks/ServicesSliderBlockView'

type LayoutBlock =
  | {
      blockType: 'features'
      id?: string | null
      title: string
      subtitle?: string | null
      cards?: { icon: string; title: string; description: string; id?: string | null }[] | null
    }
  | {
      blockType: 'servicesSlider'
      id?: string | null
      title: string
      services?: unknown[] | null
    }
  | { blockType: string; id?: string | null; [key: string]: unknown }

type RenderBlocksProps = {
  layout?: LayoutBlock[] | null
}

export function RenderBlocks({ layout }: RenderBlocksProps) {
  if (!layout?.length) return null

  return (
    <>
      {layout.map((block, index) => {
        const key = block.id ?? index

        if (block.blockType === 'features') {
          return (
            <FeaturesBlockView
              key={key}
              title={block.title}
              subtitle={block.subtitle}
              cards={block.cards}
            />
          )
        }

        if (block.blockType === 'servicesSlider') {
          return (
            <ServicesSliderBlockView
              key={key}
              title={block.title}
              services={block.services as Parameters<typeof ServicesSliderBlockView>[0]['services']}
            />
          )
        }

        return null
      })}
    </>
  )
}
