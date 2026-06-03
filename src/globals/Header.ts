import { GlobalConfig } from 'payload/types'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Üst Menü (Header)',
  access: {
    read: () => true, // Sitenin ön yüzü bu menüyü okuyabilsin
  },
  fields: [
    {
      name: 'navItems',
      label: 'Menü Linkleri',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Menü Başlığı (Örn: Hakkımızda)',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          label: 'Sayfa URLsi (Örn: /hakkimizda)',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}