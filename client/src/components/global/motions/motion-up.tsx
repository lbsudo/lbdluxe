'use client';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MotionUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewport?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

/**
 * Fade-up entrance. Previously backed by framer-motion, which pulled the whole
 * motion runtime onto the links pages; this pure-CSS version renders the same
 * transform/opacity transition without the bundle cost.
 */
export const MotionUp = ({
  children,
  className,
  delay,
  ref,
}: MotionUpProps) => {
  return (
    <div
      className={cn('motion-up', className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      ref={ref}
    >
      {children}
    </div>
  );
};
