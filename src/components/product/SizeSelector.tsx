'use client';

import { useState } from 'react';
import type { Size } from '@/types';

interface SizeSelectorProps {
  sizes?: Size[];
}

export default function SizeSelector({ sizes = [] }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {sizes.map((sizeObj, idx) => (
          <button
            key={idx}
            type="button"
            disabled={!sizeObj.available}
            onClick={() => sizeObj.available && setSelectedSize(sizeObj.label)}
            className={`
              min-w-[3rem] h-10 px-3 text-sm flex items-center justify-center transition-colors rounded-sm
              ${
                !sizeObj.available
                  ? 'border border-stone/30 text-stone line-through cursor-not-allowed'
                  : selectedSize === sizeObj.label
                  ? 'border border-graphite bg-graphite text-white'
                  : 'border border-graphite text-graphite hover:bg-stone/10'
              }
            `}
          >
            {sizeObj.label}
          </button>
        ))}
      </div>
      
      <div className="bg-ivory border border-stone/20 rounded px-4 py-2 mt-4 text-sm text-champagne">
        Bemutatótermék – online rendelés még nem érhető el.
      </div>
    </div>
  );
}
