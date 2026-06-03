import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navLinks',
      type: 'array',
      label: 'Menü Linkleri',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Etiket' },
        { name: 'url', type: 'text', required: true, label: 'URL' },
      ],
    },
  ],
}
