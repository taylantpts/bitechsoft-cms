import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Sadece güvenli görsel formatlarına izin ver (SVG intentionally excluded — XSS riski)
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    // Maksimum 10MB dosya boyutu
    staticDir: 'media',
  },
}

