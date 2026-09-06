'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'
import { formatPrice } from '@/config/brand.config'
import ProductViewer from './ProductViewer'

interface QuickViewProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

function ProductDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef(onClose)

  useEffect(() => { closeRef.current = onClose }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-label={product.name}
      onCancel={(event) => { event.preventDefault(); closeRef.current() }}
      onClick={(event) => { if (event.target === event.currentTarget) closeRef.current() }}
      className="fixed inset-0 m-auto max-h-[94svh] w-[calc(100%_-_1.5rem)] max-w-5xl overflow-y-auto overscroll-contain border-0 bg-white p-0 text-graphite shadow-2xl backdrop:bg-graphite/45 backdrop:backdrop-blur-sm md:w-[calc(100%_-_3rem)]"
    >
      <div className="relative grid bg-white md:grid-cols-[1.15fr_1fr]">
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-stone/30 bg-white/95 text-graphite transition-colors hover:bg-ivory focus-visible:outline-2 focus-visible:outline-champagne"
          aria-label="Bezárás"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" /></svg>
        </button>

        <div className="min-w-0 bg-white p-4 pb-5 sm:p-6">
          <ProductViewer product={product} compact eager />
        </div>

        <div className="flex flex-col justify-center border-t border-stone/20 px-6 py-8 md:border-l md:border-t-0 md:px-10 md:py-16">
          <span className="mb-3 text-[11px] uppercase tracking-[0.22em] text-graphite/55">{product.collection} / {product.category}</span>
          <h2 className="mb-4 font-serif text-3xl leading-tight md:text-4xl">{product.name}</h2>
          <p className="mb-6 text-lg text-graphite/80">{formatPrice(product.price)}</p>
          <p className="mb-7 text-sm leading-relaxed text-graphite/70">{product.shortDescription}</p>

          <dl className="mb-8 grid grid-cols-2 gap-5 border-y border-stone/25 py-5 text-sm">
            <div><dt className="mb-1 text-[10px] uppercase tracking-widest text-graphite/50">Szín</dt><dd>{product.color}</dd></div>
            <div><dt className="mb-1 text-[10px] uppercase tracking-widest text-graphite/50">Anyag</dt><dd>{product.material}</dd></div>
          </dl>

          <Link
            href={`/product/${product.slug}`}
            onClick={onClose}
            className="inline-flex w-full items-center justify-between bg-graphite px-5 py-4 text-xs uppercase tracking-[0.16em] text-white transition-colors hover:bg-graphite/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
          >
            Teljes bemutató <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-4 text-xs leading-relaxed text-graphite/50">Bemutatókollekció. Online rendelés egyelőre nem érhető el.</p>
        </div>
      </div>
    </dialog>
  )
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  return isOpen && product ? <ProductDialog key={product.id} product={product} onClose={onClose} /> : null
}
