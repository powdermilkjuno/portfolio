'use client';

import type { Ref } from 'react';
import Image, { ImageProps } from 'next/image';

type OptimizedImageProps = Omit<ImageProps, 'src'> & {
  src: string;
  alt: string;
  ref?: Ref<HTMLImageElement>;
};

export default function OptimizedImage({
  src,
  alt,
  loading,
  priority,
  ref,
  ...props
}: OptimizedImageProps) {
  const isSvg = src.endsWith('.svg');

  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      priority={priority}
      loading={priority ? undefined : loading ?? 'lazy'}
      unoptimized={isSvg}
      {...props}
    />
  );
}
