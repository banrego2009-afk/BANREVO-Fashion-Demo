'use client'

import React, { useRef, useEffect } from 'react'
import { Product } from '@/types'
import FallbackImage from '@/components/ui/FallbackImage'

interface ClothingRackFallbackProps {
  products: Product[]
  activeIndex: number
  onActiveChange: (index: number) => void
  isVisible?: boolean
}

export default function ClothingRackFallback({ products, activeIndex, onActiveChange, isVisible = true }: ClothingRackFallbackProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = container.offsetWidth * 0.6
      const newIndex = Math.round(scrollLeft / itemWidth)
      
      if (newIndex >= 0 && newIndex < products.length && newIndex !== activeIndex) {
        onActiveChange(newIndex)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [activeIndex, onActiveChange, products.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const itemWidth = container.offsetWidth * 0.6
    const targetScroll = activeIndex * itemWidth
    
    if (Math.abs(container.scrollLeft - targetScroll) > 10) {
      container.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }, [activeIndex])

  if (!isVisible) return null

  return (
    <div className="relative w-full flex items-center overflow-hidden" style={{ height: 'min(55vh, 500px)' }}>
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center overflow-x-auto snap-x snap-mandatory px-[20%]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product, index) => {
          const isActive = index === activeIndex
          const dist = Math.abs(index - activeIndex)
          const isNear = dist === 1
          
          return (
            <div 
              key={product.id}
              className="flex-shrink-0 w-[60%] h-full snap-center flex justify-center items-center transition-all duration-300 ease-out cursor-pointer"
              onClick={() => onActiveChange(index)}
              style={{
                opacity: isActive ? 1 : isNear ? 0.65 : 0.35,
                transform: `scale(${isActive ? 1 : isNear ? 0.85 : 0.7}) perspective(1000px) rotateY(${isActive ? 0 : index > activeIndex ? -12 : 12}deg)`,
              }}
            >
              <div className="relative w-full h-full max-w-[240px] rounded-sm overflow-hidden bg-stone/5 flex items-center justify-center">
                <FallbackImage
                  src={product.transparentGarmentImage}
                  alt={product.name}
                  width={240}
                  height={360}
                  fallbackColor={product.colorHex}
                  category={product.category}
                  productName={product.name}
                  className="object-contain p-4"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
