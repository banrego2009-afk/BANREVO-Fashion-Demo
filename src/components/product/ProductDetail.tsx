'use client';

import { Product } from '@/types';
import { formatPrice } from '@/config/brand.config';
import ProductViewer from './ProductViewer';
import SizeSelector from './SizeSelector';
import Link from 'next/link';
import { motion } from 'motion/react';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div className="w-full">
          <ProductViewer product={product} eager />
        </div>
        
        <div className="flex flex-col w-full">
          <Link 
            href={product.group === 'accessories' ? '/#accessories' : product.group === 'collection' ? '/#women' : '/#collection'}
            className="inline-flex items-center text-sm text-graphite/60 hover:text-graphite transition-colors mb-8"
          >
            ← Vissza a kollekcióhoz
          </Link>
          
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-champagne block mb-2">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-graphite mb-3">
                {product.name}
              </h1>
              <span className="text-xl font-medium text-graphite/80 block">
                {formatPrice(product.price)}
              </span>
            </div>
            
            <hr className="border-stone/20" />
            
            <p className="text-lg text-graphite/80">
              {product.shortDescription}
            </p>
            
            {product.longDescription && (
              <div className="text-graphite/60 leading-relaxed text-sm md:text-base space-y-4">
                {product.longDescription.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 py-4 text-sm mt-2">
              {product.color && (
                <div className="flex flex-col">
                  <span className="text-graphite/50 text-xs uppercase tracking-wider mb-1">Szín</span>
                  <span className="text-graphite flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-stone/20" style={{ backgroundColor: product.colorHex }} />
                    {product.color}
                  </span>
                </div>
              )}
              {product.material && (
                <div className="flex flex-col">
                  <span className="text-graphite/50 text-xs uppercase tracking-wider mb-1">Anyag</span>
                  <span className="text-graphite">{product.material}</span>
                </div>
              )}
              {product.fit && (
                <div className="flex flex-col col-span-2">
                  <span className="text-graphite/50 text-xs uppercase tracking-wider mb-1">Szabás</span>
                  <span className="text-graphite">{product.fit}</span>
                </div>
              )}
              {product.care && (
                <div className="flex flex-col col-span-2">
                  <span className="text-graphite/50 text-xs uppercase tracking-wider mb-1">Kezelés</span>
                  <span className="text-graphite">{product.care}</span>
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <span className="text-graphite/50 text-xs uppercase tracking-wider mb-3 block">
                Méretválasztás
              </span>
              <SizeSelector sizes={product.sizes} />
            </div>

            {product.collection && (
              <div className="mt-8 inline-block">
                <span className="px-3 py-1 bg-stone/10 text-graphite text-xs uppercase tracking-widest rounded-sm">
                  {product.collection}
                </span>
              </div>
            )}
            <p className="text-xs leading-relaxed text-graphite/50">
              Bemutatókollekció. Online rendelés egyelőre nem érhető el.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
