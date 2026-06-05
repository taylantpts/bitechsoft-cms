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
          const featuresBlock = block as Extract<LayoutBlock, { blockType: 'features' }>
          return (
            <FeaturesBlockView
              key={key}
              title={featuresBlock.title}
              subtitle={featuresBlock.subtitle}
              cards={featuresBlock.cards}
            />
          )
        }

        if (block.blockType === 'servicesSlider') {
          const sliderBlock = block as Extract<LayoutBlock, { blockType: 'servicesSlider' }>
          return (
            <ServicesSliderBlockView
              key={key}
              title={sliderBlock.title}
              services={sliderBlock.services as Parameters<typeof ServicesSliderBlockView>[0]['services']}
            />
          )
        }

        return null
      })}
    </>
  )
}
