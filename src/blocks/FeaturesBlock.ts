import type { Block } from 'payload'

export const FeaturesBlock: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: { singular: 'Özellikler', plural: 'Özellikler' },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Başlık' },
    { name: 'subtitle', type: 'text', label: 'Alt Metin' },
    {
      name: 'cards',
      type: 'array',
      label: 'Kartlar',
      minRows: 1,
      fields: [
        { name: 'icon', type: 'text', required: true, label: 'İkon' },
        { name: 'title', type: 'text', required: true, label: 'Başlık' },
        { name: 'description', type: 'textarea', required: true, label: 'Açıklama' },
      ],
    },
  ],
}
