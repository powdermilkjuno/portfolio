'use client';

import { useCallback, useMemo, type ReactNode } from 'react';
import WiiChannel from './WiiChannel';
import { useChannelReorder } from '../lib/useChannelReorder';
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
  const ids = useMemo(() => channels.map((c) => c.id), [channels]);

  const { order, getSlotProps, wasDragged } = useChannelReorder({
    storageKey: STORAGE_KEY,
    ids,
    slotCount,
    onPickUp: useCallback(() => playSound('hover'), [playSound]),
    onHoverTarget: useCallback(() => playSound('vacant'), [playSound]),
    onLand: useCallback(() => playSound('section'), [playSound]),
  });

  const slot = (index: number) => {
    const id = order[index];
    const channel = id ? byId.get(id) : undefined;
    const { className, ...dragProps } = getSlotProps(index);

    // Vacant slots are decorative, so they only appear where the full grid fits.
    // An occupied slot always shows, so a dragged channel can never disappear.
    if (!channel) {
      return (
        <div key={index} className={`${className} hidden aspect-[4/3] lg:block`} {...dragProps}>
          <WiiChannel empty aria-hidden="true" />
        </div>
      );
    }

    return (
      <div key={index} className={`${className} aspect-[4/3]`} {...dragProps}>
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
            if (wasDragged()) return;
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
