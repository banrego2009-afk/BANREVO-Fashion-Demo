/* ─── Product & Brand Types ─── */

export interface Size {
  label: string
  available: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  price: number
  currency: string
  shortDescription: string
  longDescription: string
  color: string
  colorHex: string
  material: string
  fit: string
  care: string
  sizes: Size[]
  images: string[]
  transparentGarmentImage: string
  viewerAssets: string[]
  featured: boolean
  detailAvailable: boolean
  collection: string
  status: 'available' | 'coming_soon'
  group: 'rack' | 'collection' | 'accessories'
}

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface BrandConfig {
  name: string
  tagline: string
  collectionName: string
  collectionNumber: string
  currency: string
  locale: string
  contact: {
    email: string
    phone: string
    address: string
  }
  social: SocialLink[]
  nav: NavItem[]
  colors: {
    cream: string
    ivory: string
    stone: string
    champagne: string
    graphite: string
    accent: string
  }
}
