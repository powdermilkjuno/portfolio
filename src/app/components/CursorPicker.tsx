'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWiiSounds } from '../lib/useWiiSounds';

const PLAYERS = [1, 2, 3, 4] as const;
type Player = (typeof PLAYERS)[number];

const STORAGE_KEY = 'wii-cursor';

function isPlayer(value: unknown): value is Player {
  return PLAYERS.includes(Number(value) as Player);
}

export default function CursorPicker() {
  const [player, setPlayer] = useState<Player>(1);
  const [open, setOpen] = useState(false);
  const playSound = useWiiSounds();

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isPlayer(stored)) setPlayer(Number(stored) as Player);
  }, []);

  // The stylesheet keys every cursor rule off this attribute.
  useEffect(() => {
    document.documentElement.dataset.cursor = String(player);
  }, [player]);

  const choose = useCallback(
    (next: Player) => {
      setPlayer(next);
      window.localStorage.setItem(STORAGE_KEY, String(next));
      playSound('section');
    },
    [playSound]
  );

  return (
    <div className={`wii-tray ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          playSound('section');
        }}
        onMouseEnter={() => playSound('hover')}
        className="wii-tray__handle"
        aria-expanded={open}
        aria-label={open ? 'Close pointer settings' : 'Open pointer settings'}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/wii-pointer-p${player}-lg.png`} alt="" width={24} height={24} aria-hidden="true" />
        <span className="wii-tray__handle-label">POINTER</span>
      </button>

      <div className="wii-tray__panel" aria-hidden={!open}>
        <div className="wii-tray__title">POINTER</div>
        <div className="wii-tray__list">
          {PLAYERS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => choose(n)}
              onMouseEnter={() => playSound('hover')}
              className={`wii-tray__option ${n === player ? 'is-active' : ''}`}
              aria-pressed={n === player}
              tabIndex={open ? 0 : -1}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/wii-pointer-p${n}-lg.png`} alt="" width={30} height={30} aria-hidden="true" />
              <span>P{n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
