import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'baslik',
    defaultColumns: ['baslik', 'ikon', 'createdAt'],
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
      name: 'ikon',
      type: 'text',
      required: true,
      label: 'İkon',
      admin: {
        description: 'Lucide ikon adı (örn: Code, Rocket, Shield)',
      },
    },
    {
      name: 'aciklama',
      type: 'textarea',
      required: true,
      label: 'Açıklama',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Görsel',
    },
  ],
  timestamps: true,
}
