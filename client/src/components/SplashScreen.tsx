import logo from '@/assets/Logo.svg';

import { useState, useEffect } from 'react';

/**
 * SplashScreen component
 *
 * @param visible – controls the fade‑in/fade‑out animation
 * @param onHidden – optional callback fired after the fade‑out completes
 * @param durationMs – optional duration (ms) for the loading‑bar animation (default 2500)
 */
export default function SplashScreen({
  visible,
  onHidden,
  durationMs,
}: {
  visible: boolean;
  onHidden?: () => void;
  durationMs?: number;
}) {
  // Keep the component mounted while it is visible *or* during the fade‑out animation.
  const [isMounted, setIsMounted] = useState(true);
  // Start with show = false for fade‑in animation
  const [show, setShow] = useState(false);

  // Loading‑bar duration (fallback to 2500 ms)
  const barDuration = durationMs ?? 2500;

  // Compute transition duration based on direction
  const transitionClass = show ? 'duration-300' : 'duration-500';

  // React to `visible` changes
  useEffect(() => {
    if (visible) {
      setShow(true); // start fade‑in (0 → 100%)
    } else {
      setShow(false); // start fade‑out (100 → 0%)
      // after the CSS transition, clean up
      const timer = setTimeout(() => {
        setIsMounted(false);
        onHidden?.();
      }, 500); // match fade‑out duration
      return () => clearTimeout(timer);
    }
  }, [visible, onHidden]);

  // If we have already unmounted after fade‑out, render nothing
  if (!isMounted) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-cover bg-center bg-black transition-opacity ${transitionClass}
        ${show ? 'opacity-100' : 'opacity-0'}
        ${!show ? 'pointer-events-none' : ''}
      `}

      aria-hidden="true"
    >
      <img
        src={logo}
        alt="Logo"
        className={`h-100 w-100 transition-opacity ${transitionClass}`}
      />
      {/* Loading bar – replaces spinner */}
      <div
        className="mt-4 w-64 max-w-[300px] h-1 bg-neutral-600 overflow-hidden rounded"
        style={{ '--loading-duration': `${barDuration}ms` } as any}
      >
        <div
          className="h-full bg-white w-0 animate-loading-bar"
          onAnimationEnd={onHidden}
        />
      </div>
    </div>
  );
}
