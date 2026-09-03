/**
 * Asset helper utilities
 * Centralises image paths so swapping assets doesn't require component changes.
 */

const PRODUCT_BASE = '/images/products'

export function getProductImagePath(slug: string, filename: string): string {
  return `${PRODUCT_BASE}/${slug}/${filename}`
}

export function getMainImage(slug: string): string {
  return getProductImagePath(slug, 'main.webp')
}

export function getTransparentImage(slug: string): string {
  return getProductImagePath(slug, 'transparent.webp')
}

export function getViewImages(slug: string, count: number = 4): string[] {
  return Array.from({ length: count }, (_, i) =>
    getProductImagePath(slug, `view-${i + 1}.webp`)
  )
}

export function getRotationImages(slug: string, count: number = 12): string[] {
  return Array.from({ length: count }, (_, i) =>
    getProductImagePath(slug, `rotate-${String(i + 1).padStart(2, '0')}.webp`)
  )
}

/**
 * Generates a deterministic placeholder color gradient based on product colorHex.
 * Used as fallback when actual images are not yet available.
 */
export function getPlaceholderGradient(colorHex: string, index: number = 0): string {
  const hueShift = (index * 15) % 360
  return `linear-gradient(${135 + hueShift}deg, ${colorHex}40 0%, ${colorHex}90 50%, ${colorHex}30 100%)`
}

/**
 * Generates an SVG data URI placeholder for a garment silhouette.
 * This provides a recognisable shape rather than just a blank gradient.
 */
export function getGarmentSilhouetteSvg(
  type: string,
  colorHex: string,
  width: number = 400,
  height: number = 600
): string {
  const silhouettes: Record<string, string> = {
    Ruha: `<path d="M200 80 Q160 80 150 120 L130 200 Q120 240 140 260 L120 500 Q120 540 180 540 L220 540 Q280 540 280 500 L260 260 Q280 240 270 200 L250 120 Q240 80 200 80Z" fill="${colorHex}" opacity="0.6"/>
           <ellipse cx="200" cy="65" rx="25" ry="18" fill="${colorHex}" opacity="0.4"/>`,
    Szett: `<path d="M170 100 Q155 100 150 130 L145 220 L140 230 L155 230 L160 180 L175 180 L175 230 L225 230 L225 180 L240 180 L245 230 L260 230 L255 220 L250 130 Q245 100 230 100Z" fill="${colorHex}" opacity="0.6"/>
            <path d="M155 240 L150 500 Q150 530 200 530 Q250 530 250 500 L245 240Z" fill="${colorHex}" opacity="0.5"/>`,
    Kabát: `<path d="M200 70 Q165 70 155 110 L120 200 L110 210 L140 220 L155 180 L145 400 Q145 520 200 520 Q255 520 255 400 L245 180 L260 220 L290 210 L280 200 L245 110 Q235 70 200 70Z" fill="${colorHex}" opacity="0.6"/>`,
    Blézer: `<path d="M200 80 Q165 80 155 115 L125 195 L115 205 L145 215 L155 185 L150 380 Q150 420 200 420 Q250 420 250 380 L245 185 L255 215 L285 205 L275 195 L245 115 Q235 80 200 80Z" fill="${colorHex}" opacity="0.6"/>`,
    Felső: `<path d="M200 90 Q170 90 160 120 L135 185 L125 195 L150 205 L160 175 L155 320 Q155 350 200 350 Q245 350 245 320 L240 175 L250 205 L275 195 L265 185 L240 120 Q230 90 200 90Z" fill="${colorHex}" opacity="0.6"/>`,
  }

  const fallback = silhouettes['Ruha']
  const shape = silhouettes[type] || fallback

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 400 600">
    <rect width="400" height="600" fill="transparent"/>
    ${shape}
    <line x1="185" y1="40" x2="200" y2="60" stroke="${colorHex}" stroke-width="1.5" opacity="0.3"/>
    <line x1="215" y1="40" x2="200" y2="60" stroke="${colorHex}" stroke-width="1.5" opacity="0.3"/>
    <line x1="185" y1="40" x2="215" y2="40" stroke="${colorHex}" stroke-width="1.5" opacity="0.3"/>
  </svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
