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
    // ─── Temel alanlar ──────────────────────────────────────────────────────
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
        description: 'Lucide ikon adı (örn: Code, Rocket, Shield, Monitor, Cloud)',
      },
    },
    {
      name: 'aciklama',
      type: 'textarea',
      required: true,
      label: 'Kısa Açıklama (Kart Ön Yüzü)',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Görsel',
    },

    // ─── Popup / Carousel Detayları ─────────────────────────────────────────
    {
      name: 'popupDetay',
      type: 'group',
      label: '🪟 Carousel Popup Detayları',
      admin: {
        description:
          'Kullanıcı kartta hover yaptığında açılan popup bölümünün içeriği. Tüm alanlar isteğe bağlıdır.',
      },
      fields: [
        {
          name: 'kisaOzet',
          type: 'text',
          label: 'Kısa Özet',
          admin: {
            description: 'Popup başlığının altında çıkacak tek cümlelik özet.',
          },
        },
        {
          name: 'ozellikler',
          type: 'array',
          label: 'Maddeler Halinde Özellikler',
          admin: {
            description: 'Madde madde listelenecek hizmet özellikleri.',
          },
          fields: [
            {
              name: 'madde',
              type: 'text',
              required: true,
              label: 'Özellik',
            },
          ],
        },
        {
          name: 'istatistik',
          type: 'text',
          label: 'Vurgulu İstatistik / Metin',
          admin: {
            description: 'Örn: "%99.9 Uptime" veya "7/24 Destek". Popup\'un alt köşesinde büyük punto ile çıkar.',
          },
        },
        {
          name: 'istatistikAlt',
          type: 'text',
          label: 'İstatistik Alt Metni',
          admin: {
            description: 'İstatistik numarasının altında küçük açıklama. Örn: "Kesintisiz Hizmet Garantisi".',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
