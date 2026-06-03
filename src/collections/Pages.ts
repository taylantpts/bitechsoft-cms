import type { CollectionConfig } from 'payload'
import { FeaturesBlock } from '../blocks/FeaturesBlock'
import { ServicesSliderBlock } from '../blocks/ServicesSliderBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Başlık' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Layout',
      blocks: [FeaturesBlock, ServicesSliderBlock],
    },
  ],
  timestamps: true,
}
