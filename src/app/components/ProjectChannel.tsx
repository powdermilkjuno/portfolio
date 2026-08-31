'use client';

import { useState } from 'react';
import { Link1Icon } from '@radix-ui/react-icons';
import WiiChannel from './WiiChannel';
import OptimizedImage from './OptimizedImage';
import ChannelVideo from './ChannelVideo';
import type { Project } from '../data/projects';

type ProjectChannelProps = {
  project: Project;
  onTune?: () => void;
};

export default function ProjectChannel({ project, onTune }: ProjectChannelProps) {
  const [pinned, setPinned] = useState(false);
  const { media } = project;

  return (
    <div
      className={`wii-flip aspect-[4/3] ${pinned ? 'is-flipped' : ''}`}
      onMouseEnter={onTune}
      onClick={() => setPinned((value) => !value)}
    >
      <div className="wii-flip__inner">
        {/* Front: the channel as it sits in the Wii Menu grid */}
        <div className="wii-flip__face">
          <WiiChannel
            className="wii-channel--interactive"
            screenClassName="wii-channel__screen--art flex flex-col"
          >
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              {media.kind === 'video' ? (
                <ChannelVideo
                  src={media.src}
                  poster={media.poster}
                  label={media.alt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <OptimizedImage
                  src={media.src}
                  alt={media.alt}
                  width={180}
                  height={180}
                  sizes="180px"
                  className="max-h-[70%] w-auto object-contain"
                />
              )}
            </div>

            <div className="wii-channel__label">{project.title}</div>
          </WiiChannel>
        </div>

        {/* Back: the channel preview screen with the details */}
        <div className="wii-flip__face wii-flip__face--back">
          <WiiChannel
            className="wii-channel--interactive"
            screenClassName="wii-channel__screen--light flex flex-col p-5"
          >
            <h3 className="text-base font-bold leading-tight text-blue-600">
              {project.title}
            </h3>

            <p className="mt-2 flex-1 overflow-hidden text-[13px] leading-snug text-slate-600">
              {project.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="wii-tag">
                  {tag}
                </span>
              ))}
            </div>

            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="wii-pill mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-semibold"
              >
                View project
                <Link1Icon className="h-3.5 w-3.5" />
              </a>
            )}
          </WiiChannel>
        </div>
      </div>
    </div>
  );
}
