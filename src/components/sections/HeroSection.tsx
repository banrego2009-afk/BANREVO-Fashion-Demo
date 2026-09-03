'use client'

import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ScrollIndicator from '@/components/ui/ScrollIndicator';

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-ivory to-cream overflow-hidden px-4 py-20">
      {/* Decorative radial highlight */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] max-w-4xl bg-white/40 rounded-full blur-3xl opacity-50 mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center mt-12 mb-auto">
        {/* Visual center piece placeholder */}
        <div className="relative w-full max-w-3xl aspect-[16/9] md:aspect-[21/9] mb-12 overflow-hidden rounded-sm">
          <motion.div 
            className="w-full h-full"
            style={{ 
              background: 'radial-gradient(circle at center, #E8E3DA 0%, #D8D3CB 100%)',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
            }}
            animate={prefersReducedMotion ? {} : { scale: [1, 1.03, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div 
          className="text-center flex flex-col items-center max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6"
          >
            <span className="uppercase tracking-[0.3em] text-xs text-champagne font-medium">
              NEW COLLECTION / 01
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-graphite mb-6 leading-tight"
          >
            Mozgásra tervezve.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            className="text-base text-graphite/70 mb-10 max-w-lg leading-relaxed"
          >
            Tíz női darab. Egy könnyed, kortárs kollekció, amely minden nézőpontból felfedezhető.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          >
            <button 
              onClick={() => {
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border border-graphite px-8 py-3 text-sm tracking-wider uppercase font-medium hover:bg-graphite hover:text-ivory transition-colors duration-300"
            >
              Felfedezem a kollekciót
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-auto pt-10">
        <ScrollIndicator />
      </div>
    </section>
  );
}
