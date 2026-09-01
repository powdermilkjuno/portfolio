'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import WiiChannel from './WiiChannel';
import { useWiiSounds } from '../lib/useWiiSounds';

export interface NavChannel {
  id: string;
  title: string;
  blurb: string;
}

interface ChannelGridProps {
  channels: NavChannel[];
  /** The two-column channel. It holds its position and never takes part in dragging. */
  wide: ReactNode;
  /** Total single-width slots, vacant ones included. */
  slotCount?: number;
  /** How many single-width slots come before the wide channel. */
  wideAfter?: number;
  titleClassName?: string;
  onOpen: (id: string) => void;
}

const STORAGE_KEY = 'wii-channel-order';

export default function ChannelGrid({
  channels,
  wide,
  slotCount = 6,
  wideAfter = 5,
  titleClassName = '',
  onOpen,
}: ChannelGridProps) {
  const playSound = useWiiSounds();
  const byId = useMemo(() => new Map(channels.map((c) => [c.id, c])), [channels]);

  const [order, setOrder] = useState<(string | null)[]>(() => {
    const initial = Array<string | null>(slotCount).fill(null);
    channels.forEach((channel, i) => {
      if (i < slotCount) initial[i] = channel.id;
    });
    return initial;
  });
  const [hydrated, setHydrated] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);
  /** A drop shouldn't also navigate, so clicks are suppressed just after a drag. */
  const didDrag = useRef(false);

  // Restore a saved arrangement, but only if it still describes exactly this
  // set of channels — otherwise a renamed channel would vanish from the grid.
  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved: unknown = JSON.parse(raw);
        const ids = channels.map((c) => c.id).sort();
        if (
          Array.isArray(saved) &&
          saved.length === slotCount &&
          JSON.stringify(saved.filter(Boolean).sort()) === JSON.stringify(ids)
        ) {
          setOrder(saved as (string | null)[]);
        }
      } catch {
        // Corrupt entry; the default arrangement stands.
      }
    }
    setHydrated(true);
  }, [channels, slotCount]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  }, [order, hydrated]);

  const drop = useCallback(
    (to: number) => {
      const from = dragFrom.current;
      setOver(null);
      if (from === null || from === to) return;
      setOrder((prev) => {
        const next = [...prev];
        [next[from], next[to]] = [next[to], next[from]];
        return next;
      });
      playSound('section');
    },
    [playSound]
  );

  const slot = (index: number) => {
    const id = order[index];
    const channel = id ? byId.get(id) : undefined;

    const dropProps = {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOver(index);
      },
      onDragLeave: () => setOver((current) => (current === index ? null : current)),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        drop(index);
      },
    };

    const state = [
      'wii-slot',
      dragging === index ? 'wii-slot--dragging' : '',
      over === index && dragging !== index ? 'wii-slot--over' : '',
    ]
      .filter(Boolean)
      .join(' ');

    // Vacant slots are decorative, so they only appear where the full grid fits.
    // An occupied slot always shows, so a dragged channel can never disappear.
    if (!channel) {
      return (
        <div key={index} className={`${state} hidden aspect-[4/3] lg:block`} {...dropProps}>
          <WiiChannel empty aria-hidden="true" />
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`${state} aspect-[4/3]`}
        draggable
        onDragStart={(e) => {
          dragFrom.current = index;
          didDrag.current = true;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', channel.id);
          setDragging(index);
          playSound('hover');
        }}
        onDragEnd={() => {
          dragFrom.current = null;
          setDragging(null);
          setOver(null);
          window.setTimeout(() => {
            didDrag.current = false;
          }, 0);
        }}
        {...dropProps}
      >
        {/* A div rather than a button: Firefox refuses to start a native drag
            when the gesture begins on a form control. */}
        <WiiChannel
          className="wii-channel--interactive"
          role="button"
          tabIndex={0}
          aria-label={`${channel.title}. ${channel.blurb}`}
          screenClassName="wii-channel__screen--light flex flex-col items-center justify-center p-4 text-center"
          onMouseEnter={() => playSound('hover')}
          onClick={() => {
            if (didDrag.current) return;
            onOpen(channel.id);
          }}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            onOpen(channel.id);
          }}
        >
          <h3 className={`text-xl wii-subheading ${titleClassName}`}>{channel.title}</h3>
          <p className="mt-1 text-xs text-slate-500">{channel.blurb}</p>
        </WiiChannel>
      </div>
    );
  };

  const before = Array.from({ length: wideAfter }, (_, i) => slot(i));
  const after = Array.from({ length: slotCount - wideAfter }, (_, i) => slot(wideAfter + i));

  return (
    <div className="mt-12 grid w-full max-w-5xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {before}
      <div className="col-span-2 aspect-[8/3]">{wide}</div>
      {after}
    </div>
  );
}
