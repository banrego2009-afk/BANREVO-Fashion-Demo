'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ScrollIndicator from '@/components/ui/ScrollIndicator';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[85vh] flex flex-col items-center justify-center bg-ivory overflow-hidden px-4 pt-24 pb-8">
      {/* Background Image with Masking */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div 
          className="relative w-full h-full max-w-[1600px]"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.015, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Masked image that fades into the ivory background at edges. Less opacity overlay than before, more contrast. */}
          <div 
            className="absolute inset-0 z-0"
            style={{ 
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 85%)'
            }}
          >
            <Image 
              src="/images/hero.webp" 
              alt="ATELIER N°10 tavaszi kollekció divatfotó" 
              fill
              priority
              className="object-cover object-center opacity-[0.88]"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-end flex-grow pb-12">
        <motion.div 
          className="text-center flex flex-col items-center max-w-xl px-4 py-8 bg-ivory/20 backdrop-blur-[10px] rounded-2xl border border-ivory/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="mb-5"
          >
            <span className="uppercase tracking-[0.3em] text-[10px] sm:text-xs text-champagne font-medium">
              NEW COLLECTION / 01
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-graphite mb-5 leading-tight tracking-tight"
          >
            Mozgásra tervezve.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            className="text-sm md:text-base text-graphite/85 mb-8 max-w-md leading-relaxed"
          >
            Tíz női darab. Egy könnyed, kortárs kollekció, amely minden nézőpontból felfedezhető.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          >
            <button 
              onClick={() => {
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border border-graphite px-8 py-3 text-xs md:text-sm tracking-widest uppercase font-medium hover:bg-graphite hover:text-ivory transition-colors duration-300 bg-transparent"
            >
              Felfedezem a kollekciót
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-auto pb-2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
