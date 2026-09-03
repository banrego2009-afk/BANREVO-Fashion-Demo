'use client'

import { useState } from 'react';
import Image from 'next/image';
import PlaceholderImage from './PlaceholderImage';

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  fallbackColor?: string;
  category?: string;
  productName?: string;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
}

export default function FallbackImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority,
  fallbackColor,
  category,
  productName,
  className = '',
  style,
  draggable,
}: FallbackImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <PlaceholderImage 
        width={fill ? '100%' : width} 
        height={fill ? '100%' : height} 
        label={productName || alt} 
        colorHex={fallbackColor}
        category={category}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={!fill ? (width || 400) : undefined}
      height={!fill ? (height || 600) : undefined}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
      draggable={draggable}
      onError={() => setHasError(true)}
    />
  );
}
