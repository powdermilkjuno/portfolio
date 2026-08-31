'use client';

import { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';

type WiiChannelBaseProps = {
  children?: ReactNode;
  className?: string;
  screenClassName?: string;
  /** Renders the recessed look of an unfilled Wii Menu grid slot. */
  empty?: boolean;
};

type WiiChannelAsButton = WiiChannelBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' };

type WiiChannelAsDiv = WiiChannelBaseProps &
  HTMLAttributes<HTMLDivElement> & { as?: 'div' };

type WiiChannelProps = WiiChannelAsButton | WiiChannelAsDiv;

export default function WiiChannel({
  children,
  className = '',
  screenClassName = '',
  empty = false,
  as = 'div',
  ...rest
}: WiiChannelProps) {
  const classes = [
    'wii-channel',
    as === 'button' && 'wii-channel--interactive',
    empty && 'wii-channel--empty',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <div className="wii-channel__bezel" aria-hidden="true" />
      <div className={`wii-channel__screen ${screenClassName}`.trim()}>
        {children}
      </div>
    </>
  );

  if (as === 'button') {
    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button type="button" className={classes} {...buttonProps}>
        {inner}
      </button>
    );
  }

  const divProps = rest as HTMLAttributes<HTMLDivElement>;
  return (
    <div className={classes} {...divProps}>
      {inner}
    </div>
  );
}
