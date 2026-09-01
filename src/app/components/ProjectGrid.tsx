'use client';

import { useCallback, useMemo } from 'react';
import ProjectChannel from './ProjectChannel';
import WiiChannel from './WiiChannel';
import { useChannelReorder } from '../lib/useChannelReorder';
import { useWiiSounds } from '../lib/useWiiSounds';
import type { Project } from '../data/projects';

const STORAGE_KEY = 'wii-project-order';

/** Columns in the widest layout, which vacant slots round the grid out to. */
const WIDEST_COLUMNS = 3;

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const playSound = useWiiSounds();
  const byId = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const ids = useMemo(() => projects.map((p) => p.id), [projects]);
  const slotCount = Math.ceil(projects.length / WIDEST_COLUMNS) * WIDEST_COLUMNS;

  const { order, getSlotProps, wasDragged } = useChannelReorder({
    storageKey: STORAGE_KEY,
    ids,
    slotCount,
    onPickUp: useCallback(() => playSound('hover'), [playSound]),
    onHoverTarget: useCallback(() => playSound('vacant'), [playSound]),
    onLand: useCallback(() => playSound('section'), [playSound]),
  });

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {order.map((id, index) => {
        const project = id ? byId.get(id) : undefined;
        const { className, ...dragProps } = getSlotProps(index);

        // Vacant slots are decorative, so they only appear where the full grid
        // fits. An occupied slot always shows, so a dragged channel can never
        // disappear.
        if (!project) {
          return (
            <div
              key={`vacant-${index}`}
              className={`${className} hidden aspect-[4/3] lg:block`}
              {...dragProps}
            >
              <WiiChannel empty aria-hidden="true" />
            </div>
          );
        }

        return (
          <div
            key={project.id}
            className={className}
            {...dragProps}
            // Landing a channel shouldn't also tune it to its back face.
            onClickCapture={(e) => {
              if (wasDragged()) e.stopPropagation();
            }}
          >
            <ProjectChannel project={project} onTune={() => playSound('hover')} />
          </div>
        );
      })}
    </div>
  );
}
