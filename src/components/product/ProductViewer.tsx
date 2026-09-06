'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'

interface ProductViewerProps {
  product: Product
  compact?: boolean
  eager?: boolean
}

function viewLabel(src: string, index: number, accessories: boolean) {
  if (/\/back\./.test(src)) return 'Hátulnézet'
  if (/\/side\./.test(src)) return 'Oldalnézet'
  if (/\/detail\./.test(src)) return 'Részlet'
  if (index === 0) return accessories ? 'Termékfotó' : 'Elölnézet'
  return `Nézet ${index + 1}`
}

function Gallery({ product, compact = false, eager = false }: ProductViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null)
  const images = [...new Set(product.images)]
  const multiple = images.length > 1
  const accessories = product.group === 'accessories'
  const selectRelative = (direction: number) => {
    setCurrentIndex((index) => (index + direction + images.length) % images.length)
  }

  return (
    <div
      className="w-full min-w-0"
      role="region"
      aria-label={`${product.name} – képgaléria`}
      onKeyDown={(event) => {
        if (!multiple) return
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          event.stopPropagation()
          selectRelative(event.key === 'ArrowRight' ? 1 : -1)
        }
      }}
    >
      <div
        className={`relative mx-auto w-full overflow-hidden bg-white outline-none focus-visible:ring-2 focus-visible:ring-champagne ${compact ? 'aspect-[3/4] max-h-[56svh] md:max-h-[65svh]' : 'aspect-[3/4] max-h-[76svh]'} ${multiple ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{ touchAction: 'pan-y' }}
        tabIndex={multiple ? 0 : undefined}
        aria-label={multiple ? 'Termékképek. Lapozás a bal és jobb nyíllal, vagy oldalirányú húzással.' : undefined}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (!multiple || (event.pointerType === 'mouse' && event.button !== 0)) return
          if ((event.target as HTMLElement).closest('button')) return
          pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerUp={(event) => {
          const start = pointerStart.current
          pointerStart.current = null
          if (!start || start.id !== event.pointerId) return
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
          const dx = event.clientX - start.x
          const dy = event.clientY - start.y
          if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.25) selectRelative(dx < 0 ? 1 : -1)
        }}
        onPointerCancel={() => { pointerStart.current = null }}
        onLostPointerCapture={() => { pointerStart.current = null }}
      >
        {images.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-200 motion-reduce:transition-none"
            style={{ opacity: index === currentIndex ? 1 : 0, pointerEvents: 'none' }}
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={src}
              alt={`${product.name} – ${viewLabel(src, index, accessories).toLocaleLowerCase('hu-HU')}`}
              fill
              sizes={compact ? '(max-width: 767px) 90vw, 540px' : '(max-width: 1023px) 94vw, 600px'}
              loading={eager || index === currentIndex ? 'eager' : 'lazy'}
              fetchPriority={eager && index === 0 ? 'high' : 'auto'}
              draggable={false}
              className="select-none object-contain"
            />
          </div>
        ))}
        {multiple && (
          <>
            <button type="button" onClick={() => selectRelative(-1)} aria-label="Előző kép" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone/40 bg-white/90 text-graphite transition-colors hover:bg-ivory focus-visible:outline-2 focus-visible:outline-champagne">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>
            </button>
            <button type="button" onClick={() => selectRelative(1)} aria-label="Következő kép" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone/40 bg-white/90 text-graphite transition-colors hover:bg-ivory focus-visible:outline-2 focus-visible:outline-champagne">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.14em] text-graphite/65" aria-live="polite" aria-atomic="true">
        <span>{viewLabel(images[currentIndex] || '', currentIndex, accessories)}</span>
        <span>{String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      </div>

      {multiple && (
        <div className="mt-4 flex justify-center gap-3" aria-label="Kép kiválasztása">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={viewLabel(src, index, accessories)}
              aria-pressed={currentIndex === index}
              className={`relative h-20 w-16 overflow-hidden border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne ${currentIndex === index ? 'border-graphite' : 'border-stone/30 hover:border-graphite/50'}`}
            >
              <Image src={src} alt="" fill sizes="64px" draggable={false} className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductViewer(props: ProductViewerProps) {
  return <Gallery key={props.product.id} {...props} />
}
