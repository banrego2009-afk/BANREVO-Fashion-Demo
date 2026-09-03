import type { BrandConfig } from '@/types'

export const brand: BrandConfig = {
  name: 'ATELIER N°10',
  tagline: 'Mozgásra tervezve.',
  collectionName: 'Nyár',
  collectionNumber: '01',
  currency: 'Ft',
  locale: 'hu-HU',

  contact: {
    email: 'hello@ateliern10.hu',
    phone: '+36 1 234 5678',
    address: 'Budapest, Andrássy út 10.',
  },

  social: [
    { platform: 'Instagram', url: 'https://instagram.com/ateliern10', label: '@ateliern10' },
    { platform: 'Pinterest', url: 'https://pinterest.com/ateliern10', label: 'Pinterest' },
    { platform: 'Facebook', url: 'https://facebook.com/ateliern10', label: 'Facebook' },
  ],

  nav: [
    { label: 'Új kollekció', href: '#collection' },
    { label: 'Női darabok', href: '#women' },
    { label: 'Kiegészítők', href: '#accessories' },
    { label: 'A márkáról', href: '#about' },
    { label: 'Üzlet', href: '/store' },
  ],

  colors: {
    cream: '#F4F1EB',
    ivory: '#FAF8F4',
    stone: '#D8D3CB',
    champagne: '#B8A98F',
    graphite: '#171717',
    accent: '#C2B8A3',
  },
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('hu-HU')} ${brand.currency}`
}
