'use client';

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
      className="group cursor-pointer bg-white rounded-sm overflow-hidden hover:shadow-sm transition-shadow duration-300 flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone/10">
        <motion.div
          className="w-full h-full"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <FallbackImage
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={400}
            fallbackColor={product.colorHex}
            category={product.category}
            productName={product.name}
            className="object-cover w-full h-full"
          />
        </motion.div>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <span className="text-xs uppercase tracking-widest text-champagne">
          {product.category}
        </span>
        <h3 className="font-serif text-lg text-graphite">{product.name}</h3>
        <span className="text-sm font-medium text-graphite/80">
          {formatPrice(product.price)}
        </span>
        <div className="mt-2 text-sm text-champagne opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Megnézem →
        </div>
      </div>
    </div>
  );
}
