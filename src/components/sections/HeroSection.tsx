'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ScrollIndicator from '@/components/ui/ScrollIndicator';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex flex-col items-center justify-center bg-ivory overflow-hidden px-4 pt-20 pb-12">
      {/* Background Image with Masking */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <motion.div 
          className="relative w-full h-full max-w-[1400px]"
          animate={prefersReducedMotion ? {} : { scale: [1, 1.02, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Masked image that fades into the ivory background at edges */}
          <div 
            className="absolute inset-0 z-0"
            style={{ 
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 75%)'
            }}
          >
            <Image 
              src="/images/hero.webp" 
              alt="ATELIER N°10 tavaszi kollekció divatfotó" 
              fill
              priority
              className="object-cover object-center opacity-80"
              sizes="100vw"
            />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-end flex-grow pb-16">
        <motion.div 
          className="text-center flex flex-col items-center max-w-2xl px-6 py-8 bg-ivory/40 backdrop-blur-[2px] rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-4"
          >
            <span className="uppercase tracking-[0.3em] text-[10px] sm:text-xs text-champagne font-medium">
              NEW COLLECTION / 01
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="font-serif text-4xl md:text-5xl lg:text-7xl text-graphite mb-4 leading-tight drop-shadow-sm"
          >
            Mozgásra tervezve.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="text-sm md:text-base text-graphite/80 mb-8 max-w-md leading-relaxed"
          >
            Tíz női darab. Egy könnyed, kortárs kollekció, amely minden nézőpontból felfedezhető.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.45 }}
          >
            <button 
              onClick={() => {
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border border-graphite px-8 py-3 text-xs md:text-sm tracking-widest uppercase font-medium hover:bg-graphite hover:text-ivory transition-colors duration-300"
            >
              Felfedezem a kollekciót
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-auto pb-4">
        <ScrollIndicator />
      </div>
    </section>
  );
}
