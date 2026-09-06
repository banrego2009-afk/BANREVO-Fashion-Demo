'use client'

import type { MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'
import { formatPrice } from '@/config/brand.config'

interface ProductCardProps {
  product: Product
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      prefetch={false}
      onClick={onClick}
      onDragStart={(event) => event.preventDefault()}
      draggable={false}
      className="group flex h-full select-none flex-col overflow-hidden rounded-sm bg-ivory outline-none transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-champagne"
      aria-label={`${product.name} – részletes bemutató`}
    >
      <div className="pointer-events-none relative aspect-[4/5] overflow-hidden bg-white">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 767px) 78vw, (max-width: 1023px) 260px, 280px"
          draggable={false}
          className="select-none object-contain transition-transform duration-500 group-hover:scale-[1.015] motion-reduce:transform-none"
        />
      </div>
      <div className="pointer-events-none flex flex-col gap-1 bg-ivory p-4">
        <span className="font-sans text-xs uppercase tracking-widest text-graphite/55">{product.category}</span>
        <h3 className="font-serif text-lg text-graphite">{product.name}</h3>
        <span className="font-sans text-sm text-graphite/80">{formatPrice(product.price)}</span>
      </div>
    </Link>
  )
}
