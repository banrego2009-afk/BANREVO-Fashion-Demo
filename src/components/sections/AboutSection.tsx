'use client'

import { motion } from 'motion/react';
import { useIntersection } from '@/hooks/useIntersection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { brand } from '@/config/brand.config';

export default function AboutSection() {
  const [ref, isVisible] = useIntersection({ threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" ref={ref} className="w-full bg-ivory py-24 lg:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        <motion.div 
          className="order-2 lg:order-1 flex flex-col max-w-xl"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="mb-6">
            <span className="uppercase tracking-[0.2em] text-xs text-champagne font-medium">
              {brand.collectionNumber} — {brand.collectionName}
            </span>
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl text-graphite mb-10">
            A történetünk
          </h2>
          
          <div className="space-y-6 text-graphite/80 leading-relaxed">
            <p>
              Olyan nőknek tervezünk ruhákat, akik folyamatos mozgásban vannak. Számunkra a divat nem egy statikus kép, hanem a mindennapi élet ritmusának leképezése.
            </p>
            <p>
              Hiszünk a minőségi anyagok erejében és a kortárs, mégis időtálló formatervezésben. Minden darabunkat úgy alkotjuk meg, hogy az elegancia soha ne menjen a kényelem rovására.
            </p>
            <p>
              Műhelyünk filozófiája a kevesebb, de jobb elvére épül. Fenntarthatóbb, tudatosabb gardróbot építünk, egyetlen tökéletesre szabott alapdarabbal kezdve.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="order-1 lg:order-2 w-full aspect-[3/4] md:aspect-[4/5] bg-stone/20 relative overflow-hidden rounded-sm"
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          <div 
            className="absolute inset-0 opacity-40"
            style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.05) 100%)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-graphite/20">
            <span className="uppercase tracking-widest text-xs">Editorial Photo</span>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
