'use client';
import { ReactNode, RefObject } from 'react';
import { motion } from 'framer-motion';

interface DownwardMotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewport?: boolean;
  ref?: RefObject<HTMLDivElement>;
}

export const MotionDown = ({
  children,
  className,
  delay,
  viewport,
  ref,
}: DownwardMotionProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        viewport={{ once: viewport }}
        className={className}
        ref={ref}
      >
        {children}
      </motion.div>
    </>
  );
};
