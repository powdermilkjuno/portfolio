'use client';

import { useEffect, useRef } from 'react';

type ChannelVideoProps = {
  src: string;
  poster: string;
  label: string;
  className?: string;
};

/** Plays only while on screen so off-screen channels cost nothing to decode. */
export default function ChannelVideo({ src, poster, label, className = '' }: ChannelVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}
