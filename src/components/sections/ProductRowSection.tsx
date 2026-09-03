'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import type { Product } from '@/types'
import ProductCard from '@/components/product/ProductCard'
import QuickView from '@/components/product/QuickView'

interface ProductRowSectionProps {
  id?: string
  title: string
  products: Product[]
}

export default function ProductRowSection({ id, title, products }: ProductRowSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector(':scope > div')?.clientWidth ?? 260
    const distance = cardWidth + 16
    el.scrollBy({ left: direction === 'left' ? -distance : distance, behavior: 'smooth' })
  }

  /* ── drag-to-scroll ── */
  const isDragging = useRef(false)
  const hasDragged = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const el = scrollRef.current
    if (!el) return
    isDragging.current = true
    hasDragged.current = false
    startX.current = e.clientX
    scrollStart.current = el.scrollLeft
    el.style.cursor = 'grabbing'
    el.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const el = scrollRef.current
    if (!el) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 5) {
      hasDragged.current = true
    }
    el.scrollLeft = scrollStart.current - dx
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    const el = scrollRef.current
    if (el) {
      el.style.cursor = 'grab'
      el.releasePointerCapture(e.pointerId)
    }
  }
  
  const handleCardClick = (product: Product, e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    setSelectedProduct(product)
  }

  return (
    <section id={id} className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Title */}
        <motion.h2
          className="font-serif text-2xl md:text-3xl text-graphite mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        {/* Row container */}
        <div className="relative group/row">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-stone/40 bg-ivory/90 backdrop-blur-sm flex items-center justify-center text-graphite hover:bg-champagne/20 transition-all opacity-0 group-hover/row:opacity-100 -translate-x-2 shadow-sm"
              aria-label="Előző termékek"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 3L5 8L10 13" />
              </svg>
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-stone/40 bg-ivory/90 backdrop-blur-sm flex items-center justify-center text-graphite hover:bg-champagne/20 transition-all opacity-0 group-hover/row:opacity-100 translate-x-2 shadow-sm"
              aria-label="Következő termékek"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 3L11 8L6 13" />
              </svg>
            </button>
          )}

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory cursor-grab touch-pan-y pb-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex-shrink-0 w-[78vw] md:w-[260px] lg:w-[280px] snap-start"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div onClick={(e) => handleCardClick(product, e)} className="h-full">
                  <ProductCard product={product} onClick={() => {}} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Fade edges */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-6 w-8 md:w-12 bg-gradient-to-r from-cream to-transparent pointer-events-none z-[5]" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-6 w-8 md:w-12 bg-gradient-to-l from-cream to-transparent pointer-events-none z-[5]" />
          )}
        </div>
      </div>

      {/* Quick view */}
      <QuickView
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  )
}
