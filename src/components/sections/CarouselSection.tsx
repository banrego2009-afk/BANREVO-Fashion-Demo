'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'motion/react'
import type { Product } from '@/types'
import { formatPrice } from '@/config/brand.config'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useIntersection } from '@/hooks/useIntersection'
import RackControls from '@/components/three/RackControls'
import ClothingRackFallback from '@/components/three/ClothingRackFallback'
import QuickView from '@/components/product/QuickView'
import Link from 'next/link'

/* Dynamically load the 3D rack — no SSR */
const ClothingRack = dynamic(
  () => import('@/components/three/ClothingRack'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-[16/10] flex items-center justify-center">
        <div className="text-champagne text-sm tracking-widest uppercase animate-pulse">
          Betöltés...
        </div>
      </div>
    ),
  }
)

interface CarouselSectionProps {
  products: Product[]
}

export default function CarouselSection({ products }: CarouselSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const isMobile = useIsMobile()
  const [containerRef, isVisible] = useIntersection({ threshold: 0.1 })

  const activeProduct = useMemo(() => products[activeIndex], [products, activeIndex])

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length)
  }, [products.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % products.length)
  }, [products.length])

  const handleActiveChange = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  /* Check for WebGL availability */
  const hasWebGL = useMemo(() => {
    if (typeof window === 'undefined') return true
    try {
      const canvas = document.createElement('canvas')
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    } catch {
      return false
    }
  }, [])

  const showFallback = isMobile || !hasWebGL

  return (
    <section id="collection" className="py-12 lg:py-20 relative" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <motion.div
          className="text-center mb-8 lg:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-champagne">
            Kollekció
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-graphite mt-2">
            Tíz darab. Tíz történet.
          </h2>
        </motion.div>

        {/* Rack container */}
        <div className="relative">
          {showFallback ? (
            <ClothingRackFallback
              products={products}
              activeIndex={activeIndex}
              onActiveChange={handleActiveChange}
              isVisible={isVisible}
            />
          ) : (
            <div className="w-full" style={{ height: 'min(65vh, 600px)' }}>
              <ClothingRack
                products={products}
                activeIndex={activeIndex}
                onActiveChange={handleActiveChange}
                isVisible={isVisible}
              />
            </div>
          )}

          {/* Edge fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-r from-cream to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-l from-cream to-transparent pointer-events-none z-10" />
        </div>

        {/* Controls */}
        <RackControls
          product={activeProduct}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        {/* Active product info */}
        {activeProduct && (
          <motion.div
            key={activeProduct.id}
            className="text-center mt-6 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            aria-live="polite"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-champagne">
              {activeProduct.category}
            </p>
            <h3 className="font-serif text-xl md:text-2xl text-graphite">
              {activeProduct.name}
            </h3>
            <p className="text-graphite/70">
              {formatPrice(activeProduct.price)}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Link
                href={`/product/${activeProduct.slug}`}
                className="inline-block border border-graphite text-graphite px-6 py-2.5 text-sm uppercase tracking-wider hover:bg-graphite hover:text-ivory transition-colors duration-300"
              >
                Részletek
              </Link>
              <button
                onClick={() => setQuickViewProduct(activeProduct)}
                className="inline-block border border-stone/40 text-graphite/70 px-6 py-2.5 text-sm uppercase tracking-wider hover:border-graphite/40 transition-colors duration-300"
              >
                Gyors nézet
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-1.5 justify-center pt-4" role="tablist" aria-label="Termékek">
              {products.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`${products[i].name}`}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'bg-champagne w-6'
                      : 'bg-stone/30 hover:bg-stone/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  )
}
