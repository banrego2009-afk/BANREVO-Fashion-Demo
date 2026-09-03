'use client'

import { getGarmentSilhouetteSvg, getPlaceholderGradient } from '@/lib/assets';

interface PlaceholderImageProps {
  width?: number | string;
  height?: number | string;
  label?: string;
  colorHex?: string;
  category?: string;
  className?: string;
}

export default function PlaceholderImage({
  width = '100%',
  height = '100%',
  label,
  colorHex = '#D8D3CB',
  category = 'Ruha',
  className = ''
}: PlaceholderImageProps) {
  const gradient = getPlaceholderGradient(colorHex);
  const silhouetteSrc = getGarmentSilhouetteSvg(category, colorHex);

  return (
    <div 
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{ width, height, background: gradient }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={silhouetteSrc}
        alt=""
        className="w-2/5 h-3/5 object-contain opacity-50"
        aria-hidden="true"
      />
      {label && (
        <div className="absolute bottom-4 left-0 right-0 text-center px-4">
          <span className="text-[10px] uppercase tracking-widest text-graphite/40 font-medium">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
