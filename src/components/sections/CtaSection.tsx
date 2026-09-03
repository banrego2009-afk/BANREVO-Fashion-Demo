'use client'

import Link from 'next/link';
import { motion } from 'motion/react';
import { useIntersection } from '@/hooks/useIntersection';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function CtaSection() {
  const [ref, isVisible] = useIntersection({ threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section ref={ref} className="w-full bg-cream py-24 lg:py-32 px-4 relative overflow-hidden">
      {/* Subtle background texture/gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
           style={{ background: 'radial-gradient(circle at 50% 100%, #FAF8F4 0%, transparent 60%)' }} 
      />
      
      <motion.div 
        className="max-w-3xl mx-auto text-center flex flex-col items-center relative z-10"
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2 className="font-serif text-3xl md:text-4xl text-graphite mb-6 leading-tight">
          A történet itt még csak elkezdődik.
        </h2>
        
        <p className="text-graphite/70 text-base mb-10 max-w-md">
          Fedezd fel a kollekció hangulatát most, a teljes online üzlet és a rendelési élmény pedig hamarosan megérkezik.
        </p>
        
        <Link 
          href="/store"
          className="inline-block border border-graphite px-8 py-3 text-sm tracking-wider uppercase font-medium hover:bg-graphite hover:text-ivory transition-colors duration-300"
        >
          Megnézem a teljes üzletet
        </Link>
      </motion.div>
    </section>
  );
}
