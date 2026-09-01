'use client';

import { useRef, useState } from 'react';
import OptimizedImage from './OptimizedImage';

/**
 * The parallax tilt is written straight to the node. Tracking the pointer in
 * React state would re-render the entire page on every mousemove.
 */
export default function AboutPhoto() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const frameRef = useRef(0);

  const applyTransform = (offsetX: number, offsetY: number, scale: number) => {
    const node = imageRef.current;
    if (!node) return;
    node.style.transform = `scale(${scale}) translate(${offsetX * 0.02}px, ${offsetY * 0.02}px)`;
  };

  return (
    <OptimizedImage
      ref={imageRef}
      src="/sebapicture.webp"
      alt="Sebastian Garcia"
      width={800}
      height={600}
      sizes="(max-width: 768px) 90vw, 400px"
      className="max-h-full max-w-full cursor-pointer rounded-sm object-contain transition-transform duration-300"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;

        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = 0;
          applyTransform(offsetX, offsetY, zoomed ? 1.5 : 1);
        });
      }}
      onMouseLeave={() => applyTransform(0, 0, zoomed ? 1.5 : 1)}
      onClick={() => {
        const next = !zoomed;
        setZoomed(next);
        applyTransform(0, 0, next ? 1.5 : 1);
      }}
    />
  );
}
