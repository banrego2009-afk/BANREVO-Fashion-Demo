'use client';

import { useState, useRef } from 'react';
import { Product } from '@/types';
import FallbackImage from '@/components/ui/FallbackImage';

interface ProductViewerProps {
  product: Product;
}

export default function ProductViewer({ product }: ProductViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number | null>(null);
  const startIndexRef = useRef<number>(0);

  const images = product.viewerAssets?.length ? product.viewerAssets : product.images;
  const hasMultipleImages = images.length > 1;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!hasMultipleImages) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startIndexRef.current = currentIndex;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || startXRef.current === null || !hasMultipleImages) return;
    
    const deltaX = e.clientX - startXRef.current;
    const pixelsPerFrame = 30;
    const frameOffset = Math.floor(deltaX / pixelsPerFrame);
    
    let newIndex = (startIndexRef.current - frameOffset) % images.length;
    if (newIndex < 0) {
      newIndex += images.length;
    }
    
    setCurrentIndex(newIndex);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!hasMultipleImages) return;
    setIsDragging(false);
    startXRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div 
        className={`relative w-full aspect-[3/4] bg-stone/10 rounded-sm overflow-hidden ${hasMultipleImages ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
        style={{ touchAction: hasMultipleImages ? 'pan-y' : 'auto' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {images.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="absolute inset-0 select-none transition-opacity duration-150"
            style={{ opacity: idx === currentIndex ? 1 : 0, pointerEvents: 'none' }}
          >
            <FallbackImage
              src={src}
              alt={`${product.name} nézet ${idx + 1}`}
              width={800}
              height={1100}
              fallbackColor={product.colorHex}
              category={product.category}
              productName={product.name}
              className="object-cover w-full h-full pointer-events-none select-none"
            />
          </div>
        ))}
      </div>
      
      {hasMultipleImages && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-graphite' : 'bg-stone/50'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-graphite/60 select-none font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Húzd el a forgatáshoz
          </div>
        </div>
      )}
    </div>
  );
}
