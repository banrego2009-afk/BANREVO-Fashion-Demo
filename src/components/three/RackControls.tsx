'use client'

import React, { useEffect } from 'react'
import { Product } from '@/types'

interface RackControlsProps {
  product: Product
  onPrev: () => void
  onNext: () => void
}

export default function RackControls({ product, onPrev, onNext }: RackControlsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPrev, onNext])

  if (!product) return null

  return (
    <div className="relative flex justify-center items-center mt-4 gap-6">
      {/* Left arrow */}
      <button 
        onClick={onPrev}
        aria-label="Előző ruha"
        className="w-10 h-10 rounded-full border border-stone/30 flex items-center justify-center text-graphite hover:border-graphite hover:bg-cream/50 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button 
        onClick={onNext}
        aria-label="Következő ruha"
        className="w-10 h-10 rounded-full border border-stone/30 flex items-center justify-center text-graphite hover:border-graphite hover:bg-cream/50 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
