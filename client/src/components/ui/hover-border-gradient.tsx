'use client';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Animated gradient border pill. Previously implemented with framer-motion;
 * now uses a pure-CSS conic gradient (`@property --lbd-angle`) so it stays off
 * the links pages' JS critical path. API is unchanged for existing callers.
 */
export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = 'button',
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  return (
    <Tag
      className={cn('lbd-border-gradient', containerClassName)}
      style={{
        ['--lbd-spin-duration' as string]: `${duration * 3}s`,
        ['--lbd-spin-direction' as string]: clockwise ? 'normal' : 'reverse',
      }}
      {...props}
    >
      <span className="lbd-border-gradient__glow" aria-hidden="true" />
      <span className={cn('lbd-border-gradient__content', className)}>
        {children}
      </span>
    </Tag>
  );
}
