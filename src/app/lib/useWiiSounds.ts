'use client';

import { useCallback, useRef } from 'react';

export type WiiSound = 'hover' | 'select' | 'section' | 'home' | 'vacant';

const SOURCES: Record<WiiSound, string> = {
  /** Pointing at a channel. */
  hover: '/sfx-hover.mp3',
  /** Picking a channel or opening a link. */
  select: '/sfx-select.mp3',
  /** Travelling to another section of the menu. */
  section: '/sfx-section.mp3',
  /** Returning to the Wii Menu. */
  home: '/sfx-home.mp3',
  /** Carrying a held channel over an empty slot. */
  vacant: '/sfx-vacant.wav',
};

const DEFAULT_VOLUME: Record<WiiSound, number> = {
  hover: 0.3,
  select: 0.4,
  section: 0.5,
  home: 0.5,
  vacant: 0.35,
};

export function useWiiSounds() {
  const cache = useRef<Partial<Record<WiiSound, HTMLAudioElement>>>({});

  return useCallback((name: WiiSound, volume?: number) => {
    if (typeof window === 'undefined') return;

    let audio = cache.current[name];
    if (!audio) {
      audio = new Audio(SOURCES[name]);
      audio.preload = 'auto';
      cache.current[name] = audio;
    }

    audio.volume = volume ?? DEFAULT_VOLUME[name];
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);
}
