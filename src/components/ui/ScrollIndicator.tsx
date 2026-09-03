'use client'

import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function ScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center space-y-2 opacity-40">
      <span className="text-[10px] uppercase tracking-[0.2em] text-graphite font-medium">Görgess</span>
      <div className="h-10 w-[1px] bg-graphite/20 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-1/2 bg-graphite"
          animate={prefersReducedMotion ? {} : { y: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
