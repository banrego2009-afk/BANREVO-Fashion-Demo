'use client'

import { useRef, useEffect, useCallback, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ClothingRackFallbackProps {
  products: Product[]
  activeIndex: number
  onActiveChange: (index: number) => void
  onOpenProduct: (product: Product) => void
  isVisible?: boolean
}

export default function ClothingRackFallback({ products, activeIndex, onActiveChange, onOpenProduct }: ClothingRackFallbackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reportedIndex = useRef(activeIndex)
  const scrollTarget = useRef<number | null>(null)
  const animation = useRef(0)
  const reducedMotion = useReducedMotion()
  const drag = useRef({ pointer: -1, startX: 0, lastX: 0, lastTime: 0, velocity: 0, moved: false, suppressClickUntil: 0 })

  const stopMomentum = useCallback(() => {
    cancelAnimationFrame(animation.current)
    animation.current = 0
  }, [])

  useEffect(() => stopMomentum, [stopMomentum])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      if (scrollTarget.current !== null) {
        if (Math.abs(container.scrollLeft - scrollTarget.current) < 2) scrollTarget.current = null
        else return
      }
      const center = container.scrollLeft + container.clientWidth / 2
      const children = Array.from(container.children) as HTMLElement[]
      let closest = 0
      let distance = Infinity
      children.forEach((child, index) => {
        const current = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center)
        if (current < distance) { distance = current; closest = index }
      })
      if (closest !== reportedIndex.current) {
        reportedIndex.current = closest
        onActiveChange(closest)
      }
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [onActiveChange])

  useEffect(() => {
    const container = containerRef.current
    const child = container?.children[activeIndex] as HTMLElement | undefined
    if (!container || !child || activeIndex === reportedIndex.current) return
    stopMomentum()
    reportedIndex.current = activeIndex
    const target = child.offsetLeft + child.offsetWidth / 2 - container.clientWidth / 2
    scrollTarget.current = target
    container.scrollTo({ left: target, behavior: reducedMotion ? 'instant' : 'smooth' })
  }, [activeIndex, reducedMotion, stopMomentum])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    stopMomentum()
    scrollTarget.current = null
    drag.current.moved = false
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { pointer: event.pointerId, startX: event.clientX, lastX: event.clientX, lastTime: performance.now(), velocity: 0, moved: false, suppressClickUntil: 0 }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (state.pointer !== event.pointerId) return
    if (!state.moved && Math.abs(event.clientX - state.startX) < 6) return
    state.moved = true
    event.currentTarget.setPointerCapture(event.pointerId)
    const now = performance.now()
    const distance = state.lastX - event.clientX
    event.currentTarget.scrollLeft += distance
    state.velocity = distance / Math.max(8, now - state.lastTime)
    state.lastX = event.clientX
    state.lastTime = now
    event.preventDefault()
  }

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current
    if (state.pointer !== event.pointerId) return
    state.pointer = -1
    if (state.moved) state.suppressClickUntil = performance.now() + 350
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (reducedMotion || event.type === 'pointercancel' || performance.now() - state.lastTime > 100) return
    let previousTime = performance.now()
    const coast = (now: number) => {
      const container = containerRef.current
      if (!container) return
      const elapsed = Math.min(32, now - previousTime)
      previousTime = now
      const before = container.scrollLeft
      container.scrollLeft += state.velocity * elapsed
      state.velocity *= Math.exp(-0.006 * elapsed)
      if (Math.abs(state.velocity) > 0.025 && Math.abs(container.scrollLeft - before) > 0.05) animation.current = requestAnimationFrame(coast)
    }
    animation.current = requestAnimationFrame(coast)
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'clamp(360px, 55svh, 480px)' }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-15%] top-7 w-[130%] h-16 rounded-[50%] border-2 border-[#b9aa8d]"
        style={{ boxShadow: '0 1px 0 #fff inset, 0 2px 2px #baa98920' }}
      />
      <div
        ref={containerRef}
        className="relative flex w-full h-full overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        style={{ paddingInline: '16%', touchAction: 'pan-x pan-y', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onDragStart={(event) => event.preventDefault()}
        aria-label="A tíz ruhadarab, oldalra húzható"
      >
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            className="relative h-full shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-champagne focus-visible:ring-inset transition-opacity duration-300"
            style={{ width: '100%', opacity: index === activeIndex ? 1 : 0.7, WebkitTapHighlightColor: 'transparent' }}
            aria-label={`${product.name} – részletes képek megnyitása`}
            onClick={(event) => {
              if (drag.current.moved || performance.now() < drag.current.suppressClickUntil) { event.preventDefault(); return }
              onOpenProduct(product)
            }}
          >
            <svg className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[40%] h-[52px] pointer-events-none" viewBox="0 0 160 75" fill="none" aria-hidden="true">
              <path d="M80 25V18C80 13 89 12 89 7C89-3 73-3 73 7" stroke="#b9a583" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M80 25L13 59Q6 65 15 65H145Q154 65 147 59L80 25Z" stroke="#b9a583" strokeWidth="2.2" strokeLinejoin="round" />
            </svg>
            <div className="absolute top-[41px] bottom-4 inset-x-0">
              <Image
                src={product.transparentGarmentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 68vw, 360px"
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                className="object-contain object-top select-none"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
