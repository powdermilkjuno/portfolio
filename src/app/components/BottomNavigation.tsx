'use client';

import { useEffect, useState } from 'react';
import { useWiiSounds } from '../lib/useWiiSounds';

interface BottomNavigationProps {
  isVisible: boolean;
}

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

/** Wii Menu bottom bar: Wii orb, section channels, clock, and message button. */
export default function BottomNavigation({ isVisible }: BottomNavigationProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [homeHeld, setHomeHeld] = useState(false);
  const playSound = useWiiSounds();

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setHomeHeld(false);
    playSound('section');
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isVisible) return null;

  const time = now
    ? now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';
  const date = now
    ? now.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' })
    : '';

  return (
    <nav className="wii-bar fixed bottom-0 left-0 right-0 z-50 px-4 py-3">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className={`wii-tip-anchor justify-self-start ${homeHeld ? 'is-held' : ''}`}>
          <button
            onClick={() => {
              playSound('home');
              setHomeHeld(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={() => playSound('hover')}
            className="wii-orb wii-orb--grey relative flex h-14 w-14 overflow-hidden p-0"
            aria-label="Home"
          >
            <img
              src="/wii-home.png"
              alt=""
              width={56}
              height={56}
              draggable={false}
              className="h-full w-full scale-110 object-cover"
              aria-hidden="true"
            />
          </button>
          <span className="wii-tip" role="tooltip">
            Home
          </span>
        </div>

        <div className="flex items-center justify-center gap-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => playSound('hover')}
              className="wii-pill px-4 py-1.5 text-sm font-semibold"
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end gap-4">
          <div className="wii-clock hidden text-right leading-none sm:block">
            <div className="text-2xl font-semibold" suppressHydrationWarning>
              {time || '\u00A0'}
            </div>
            <div className="mt-1 text-xs opacity-70" suppressHydrationWarning>
              {date || '\u00A0'}
            </div>
          </div>

          <div className="wii-tip-anchor">
            <button
              onClick={() => scrollToSection('contact')}
              onMouseEnter={() => playSound('hover')}
              className="wii-orb wii-orb--grey flex h-14 w-14 items-center justify-center"
              aria-label="Message board"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </button>
            <span className="wii-tip" role="tooltip">
              Message Board
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
