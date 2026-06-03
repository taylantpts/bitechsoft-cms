import type { CollectionConfig } from 'payload'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'baslik',
    defaultColumns: ['baslik', 'kategori', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'baslik',
      type: 'text',
      required: true,
      label: 'Başlık',
    },
    {
      name: 'kategori',
      type: 'text',
      required: true,
      label: 'Kategori',
    },
    {
      name: 'gorsel',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Görsel',
    },
    {
      name: 'canliLink',
      type: 'text',
      label: 'Canlı Link',
      admin: {
        description: 'Projenin canlı URL adresi',
      },
    },
  ],
  timestamps: true,
}
