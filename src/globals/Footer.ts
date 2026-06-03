import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'copyright', type: 'text', required: true, label: 'Telif Yazısı' },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Sosyal Medya',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Etiket' },
        { name: 'url', type: 'text', required: true, label: 'URL' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Alt Menü Kolonları',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Kolon Başlığı' },
        {
          name: 'links',
          type: 'array',
          label: 'Linkler',
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Etiket' },
            { name: 'url', type: 'text', required: true, label: 'URL' },
          ],
        },
      ],
    },
  ],
}
