'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '@/types';
import { formatPrice } from '@/config/brand.config';
import FallbackImage from '@/components/ui/FallbackImage';
import Link from 'next/link';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      panelRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-graphite/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-sm shadow-xl outline-none overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur text-graphite hover:bg-white transition-colors"
              aria-label="Bezárás"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 relative aspect-[3/4] md:aspect-auto bg-stone/10">
              <FallbackImage
                src={product.images[0]}
                alt={product.name}
                fill
                fallbackColor={product.colorHex}
                category={product.category}
                productName={product.name}
                className="object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              <span className="text-xs uppercase tracking-widest text-champagne mb-2">
                {product.category}
              </span>
              <h2 className="font-serif text-2xl text-graphite mb-2">{product.name}</h2>
              <span className="text-lg font-medium text-graphite/80 mb-6 block">
                {formatPrice(product.price)}
              </span>
              
              <p className="text-sm text-graphite/70 leading-relaxed mb-8 flex-grow">
                {product.shortDescription}
              </p>

              {product.detailAvailable ? (
                <Link
                  href={`/product/${product.slug}`}
                  className="w-full py-3 px-4 bg-graphite text-white text-center text-sm uppercase tracking-wider hover:bg-graphite/90 transition-colors rounded-sm inline-block"
                  onClick={onClose}
                >
                  Teljes bemutató →
                </Link>
              ) : (
                <div className="w-full p-4 bg-ivory text-center rounded-sm">
                  <p className="text-sm text-champagne">
                    A részletes bemutató hamarosan érkezik.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
