import type { Block } from 'payload'

export const ServicesSliderBlock: Block = {
  slug: 'servicesSlider',
  interfaceName: 'ServicesSliderBlock',
  labels: { singular: 'Hizmet Slider', plural: 'Hizmet Slider' },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Slider Başlığı' },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      required: true,
      label: 'Hizmetler',
    },
  ],
}
