'use client'

import { useRef, useState, useCallback, useEffect, type MouseEvent, type PointerEvent } from 'react'
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
  const momentumId = useRef(0)
  const suppressClickUntil = useRef(0)
  const pointer = useRef({
    active: false, id: -1, startX: 0, scrollStart: 0, lastX: 0, lastTime: 0, velocity: 0, dragged: false,
  })

  const stopMomentum = useCallback(() => {
    cancelAnimationFrame(momentumId.current)
    momentumId.current = 0
  }, [])

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    const observer = new ResizeObserver(checkScroll)
    observer.observe(el)
    el.addEventListener('scroll', checkScroll, { passive: true })
    return () => {
      observer.disconnect()
      el.removeEventListener('scroll', checkScroll)
      stopMomentum()
    }
  }, [checkScroll, stopMomentum])

  const scroll = (direction: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    stopMomentum()
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    stopMomentum()
    // Touch scrolling uses the browser's native inertia and vertical gesture handling.
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const el = scrollRef.current
    if (!el) return
    suppressClickUntil.current = 0
    pointer.current = {
      active: true, id: event.pointerId, startX: event.clientX, scrollStart: el.scrollLeft,
      lastX: event.clientX, lastTime: performance.now(), velocity: 0, dragged: false,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current
    const state = pointer.current
    if (!el || !state.active || state.id !== event.pointerId) return
    const dx = event.clientX - state.startX
    if (!state.dragged && Math.abs(dx) < 5) return
    if (!state.dragged) {
      state.dragged = true
      el.setPointerCapture(event.pointerId)
      el.style.cursor = 'grabbing'
    }
    event.preventDefault()
    el.scrollLeft = state.scrollStart - dx
    const now = performance.now()
    const dt = now - state.lastTime
    if (dt > 0) {
      const nextVelocity = -(event.clientX - state.lastX) / dt
      state.velocity = state.velocity * 0.25 + nextVelocity * 0.75
    }
    state.lastX = event.clientX
    state.lastTime = now
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>, allowMomentum: boolean) => {
    const el = scrollRef.current
    const state = pointer.current
    if (!el || !state.active || state.id !== event.pointerId) return
    state.active = false
    el.style.cursor = 'grab'
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
    if (!state.dragged) return
    suppressClickUntil.current = performance.now() + 350

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!allowMomentum || reduceMotion || performance.now() - state.lastTime > 100) return
    let velocity = Math.max(-3, Math.min(3, state.velocity))
    let lastTime = performance.now()
    const coast = (now: number) => {
      const dt = Math.min(32, now - lastTime)
      lastTime = now
      const previous = el.scrollLeft
      el.scrollLeft += velocity * dt
      velocity *= Math.exp(-dt / 190)
      if (Math.abs(velocity) > 0.025 && Math.abs(el.scrollLeft - previous) > 0.1) {
        momentumId.current = requestAnimationFrame(coast)
      } else {
        momentumId.current = 0
      }
    }
    momentumId.current = requestAnimationFrame(coast)
  }

  const handleOpenProduct = (product: Product, event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    stopMomentum()
    setSelectedProduct(product)
  }

  const closeProduct = useCallback(() => setSelectedProduct(null), [])

  return (
    <section id={id} className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.h2
          className="mb-8 font-serif text-2xl text-graphite md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>

        <div className="group/row relative">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-stone/40 bg-ivory/95 text-graphite shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-champagne"
              aria-label="Előző termékek"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll(1)}
              className="absolute right-0 top-1/2 z-10 flex h-10 w-10 translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-stone/40 bg-ivory/95 text-graphite shadow-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-champagne"
              aria-label="Következő termékek"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          )}

          <div
            ref={scrollRef}
            className="scrollbar-hide flex cursor-grab select-none gap-4 overflow-x-auto overscroll-x-contain pb-6 md:gap-5"
            style={{ scrollbarWidth: 'none', touchAction: 'pan-x pan-y', scrollSnapType: 'none', scrollBehavior: 'auto' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => finishDrag(event, true)}
            onPointerCancel={(event) => finishDrag(event, false)}
            onPointerLeave={(event) => { if (!pointer.current.dragged) finishDrag(event, false) }}
            onLostPointerCapture={(event) => finishDrag(event, false)}
            onDragStart={(event) => event.preventDefault()}
            onWheel={stopMomentum}
            onClickCapture={(event) => {
              if (performance.now() < suppressClickUntil.current) {
                event.preventDefault()
                event.stopPropagation()
              }
            }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="w-[78vw] flex-shrink-0 md:w-[260px] lg:w-[280px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <ProductCard product={product} onClick={(event) => handleOpenProduct(product, event)} />
              </motion.div>
            ))}
          </div>

          {canScrollLeft && <div className="pointer-events-none absolute bottom-6 left-0 top-0 z-[5] w-8 bg-gradient-to-r from-ivory to-transparent md:w-12" />}
          {canScrollRight && <div className="pointer-events-none absolute bottom-6 right-0 top-0 z-[5] w-8 bg-gradient-to-l from-ivory to-transparent md:w-12" />}
        </div>
      </div>
      <QuickView product={selectedProduct} isOpen={!!selectedProduct} onClose={closeProduct} />
    </section>
  )
}
