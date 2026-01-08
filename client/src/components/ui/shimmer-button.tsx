import React from 'react'
import { cn } from '@/lib/utils'

/**
 * ShimmerButton – dark‑mode‑friendly button with a simple moving gradient shimmer.
 * It forwards any extra `className` (e.g., `z-20`, `shadow-lg`) and merges it
 * with the base Tailwind classes.
 */
export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; bgClass?: string }
>(({ children, className = '', bgClass, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        // Core appearance – works on a dark background
        'relative inline-flex items-center justify-center rounded-md px-5 py-2 font-medium',
        // Background – use custom class if supplied, otherwise default dark‑mode friendly colors
        bgClass ? bgClass : 'bg-gray-800/70 dark:bg-gray-700/70',
        'text-white',
        // Enable the animated gradient overlay
        'overflow-hidden',
        // Custom shimmer animation defined in tailwind.config.js
        'animate-shimmer',
        // Subtle backdrop blur to help it blend with the page background
        'backdrop-blur-sm',
        // Allow callers to pass extra utilities (e.g., z‑index, shadows)
        className,
      )}
    >
      {/* Gradient overlay that creates the light‑sweep effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {/* Button label */}
      <span className="relative z-10">{children}</span>
    </button>
  )
})

ShimmerButton.displayName = 'ShimmerButton'
