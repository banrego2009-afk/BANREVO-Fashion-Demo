'use client';

import React from 'react';
import { Product } from '@/types';
import { formatPrice } from '@/config/brand.config';
import FallbackImage from '@/components/ui/FallbackImage';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      onDragStart={(e) => e.preventDefault()}
      className="group cursor-pointer bg-ivory rounded-sm overflow-hidden hover:shadow-sm transition-shadow duration-300 flex flex-col select-none h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone/5 pointer-events-none">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <FallbackImage
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 78vw, 260px"
            draggable={false}
            fallbackColor={product.colorHex}
            category={product.category}
            productName={product.name}
            className="object-cover w-full h-full"
            style={{ WebkitUserDrag: 'none' } as React.CSSProperties}
          />
        </motion.div>
        
        {/* Quick view overlay on hover */}
        <div className="absolute inset-0 bg-graphite/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="px-6 py-2 bg-ivory/95 text-graphite text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-300 backdrop-blur-sm"
          >
            Megnézem
          </motion.div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1 pointer-events-none bg-ivory">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-sans">
          {product.category}
        </span>
        <h3 className="font-serif text-lg text-graphite">{product.name}</h3>
        <span className="text-sm font-sans text-graphite/80">
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
}
