'use client';

import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';

interface ChannelReorderOptions {
  /** Where the arrangement is remembered between visits. */
  storageKey: string;
  /** Every channel id, in the arrangement to fall back on. */
  ids: string[];
  /** Total slots, vacant ones included. Defaults to one slot per channel. */
  slotCount?: number;
  /** Fires when a channel is picked up. */
  onPickUp?: () => void;
  /** Fires when a held channel first passes over a different slot. */
  onHoverTarget?: () => void;
  /** Fires when a channel lands somewhere new. */
  onLand?: () => void;
}

export interface SlotProps {
  /** `wii-slot`, plus the modifiers for the slot's current drag state. */
  className: string;
  draggable: boolean;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
}

/**
 * Wii Menu style rearranging: drag a channel onto any slot to trade places
 * with whatever sits there, and the arrangement survives a reload.
 */
export function useChannelReorder({
  storageKey,
  ids,
  slotCount = ids.length,
  onPickUp,
  onHoverTarget,
  onLand,
}: ChannelReorderOptions) {
  const [order, setOrder] = useState<(string | null)[]>(() => {
    const initial = Array<string | null>(slotCount).fill(null);
    ids.forEach((id, i) => {
      if (i < slotCount) initial[i] = id;
    });
    return initial;
  });
  const [hydrated, setHydrated] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);
  /** Mirrors `over`, but updates in time for the next `dragover` of a burst. */
  const overNow = useRef<number | null>(null);
  /** A drop shouldn't also count as a click, so clicks are suppressed just after a drag. */
  const didDrag = useRef(false);

  // Serialised so a caller that builds its id list inline doesn't re-run the
  // restore below on every render.
  const idsKey = JSON.stringify(ids);

  // Restore a saved arrangement, but only if it still describes exactly this
  // set of channels — otherwise a renamed channel would vanish from the grid.
  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        const saved: unknown = JSON.parse(raw);
        const expected = (JSON.parse(idsKey) as string[]).slice().sort();
        if (
          Array.isArray(saved) &&
          saved.length === slotCount &&
          JSON.stringify(saved.filter(Boolean).sort()) === JSON.stringify(expected)
        ) {
          setOrder(saved as (string | null)[]);
        }
      } catch {
        // Corrupt entry; the default arrangement stands.
      }
    }
    setHydrated(true);
  }, [idsKey, slotCount, storageKey]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(order));
  }, [order, hydrated, storageKey]);

  // A channel that moves into a vacant slot leaves its old slot rendering as
  // empty, which strips that element's drag handlers before `dragend` reaches
  // them. Listening on the window instead guarantees the drag always ends.
  const endDrag = useCallback(() => {
    dragFrom.current = null;
    overNow.current = null;
    setDragging(null);
    setOver(null);
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  }, []);

  useEffect(() => {
    if (dragging === null) return;
    window.addEventListener('dragend', endDrag);
    return () => window.removeEventListener('dragend', endDrag);
  }, [dragging, endDrag]);

  const drop = useCallback(
    (to: number) => {
      const from = dragFrom.current;
      endDrag();
      if (from === null || from === to) return;
      setOrder((prev) => {
        const next = [...prev];
        [next[from], next[to]] = [next[to], next[from]];
        return next;
      });
      onLand?.();
    },
    [endDrag, onLand]
  );

  const getSlotProps = useCallback(
    (index: number): SlotProps => {
      const id = order[index];

      return {
        className: [
          'wii-slot',
          dragging === index ? 'wii-slot--dragging' : '',
          over === index && dragging !== index ? 'wii-slot--over' : '',
        ]
          .filter(Boolean)
          .join(' '),
        draggable: id !== null,
        onDragStart: (e) => {
          if (id === null) return;
          dragFrom.current = index;
          didDrag.current = true;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', id);
          setDragging(index);
          onPickUp?.();
        },
        onDragOver: (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          // `dragover` keeps firing while a channel is held still, so the slot
          // under it has to actually change before anything reacts.
          if (overNow.current === index) return;
          overNow.current = index;
          setOver(index);
          if (index !== dragFrom.current) onHoverTarget?.();
        },
        onDragLeave: () => {
          if (overNow.current === index) overNow.current = null;
          setOver((current) => (current === index ? null : current));
        },
        onDrop: (e) => {
          e.preventDefault();
          drop(index);
        },
      };
    },
    [order, dragging, over, drop, onPickUp, onHoverTarget]
  );

  return {
    order,
    getSlotProps,
    /** True for the moment right after a drop, so a drag can't double as a click. */
    wasDragged: useCallback(() => didDrag.current, []),
  };
}
