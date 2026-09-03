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
      className="group cursor-pointer bg-ivory rounded-sm overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col select-none h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone/5 pointer-events-none">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.03 }}
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
