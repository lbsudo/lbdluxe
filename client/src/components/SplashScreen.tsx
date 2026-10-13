import logo from '@/assets/Logo.svg';

import { useState, useEffect } from 'react';

/**
 * SplashScreen component
 *
 * @param visible – controls the fade‑in/fade‑out animation
 * @param progress – 0…1 how much of the critical data is loaded; drives the loading bar
 * @param fadeOutMs – duration of the fade‑out animation before the splash unmounts (default 500)
 * @param onHidden – optional callback fired after the fade‑out completes
 */
export default function SplashScreen({
  visible,
  progress = 0,
  fadeOutMs = 500,
  onHidden,
}: {
  visible: boolean;
  progress?: number;
  fadeOutMs?: number;
  onHidden?: () => void;
}) {
  // Keep the component mounted while it is visible *or* during the fade‑out animation.
  const [isMounted, setIsMounted] = useState(true);
  // Starts visible: this component takes over from the inline #boot loader, so
  // it must not fade in from transparent (that would flash the black backdrop).
  const [show, setShow] = useState(visible);

  const pct = Math.round(Math.min(100, Math.max(0, progress * 100)));

  // Transition duration is applied inline — the previous `duration-[${ms}ms]`
  // template literal was never detected by Tailwind's compiler, so the fade-out
  // silently fell back to a default.
  const transitionDuration = show ? '300ms' : `${fadeOutMs}ms`;

  // React to `visible` changes
  useEffect(() => {
    if (visible) {
      setShow(true); // ensure visible during loading
    } else {
      setShow(false); // start fade‑out (100 → 0%)
      // after the CSS transition, clean up
      const timer = setTimeout(() => {
        setIsMounted(false);
        onHidden?.();
      }, fadeOutMs); // match fade‑out duration
      return () => clearTimeout(timer);
    }
  }, [visible, onHidden, fadeOutMs]);

  // If we have already unmounted after fade‑out, render nothing
  if (!isMounted) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex flex-col items-center justify-center
        bg-cover bg-center bg-black transition-opacity
        ${show ? 'opacity-100' : 'opacity-0'}
        ${!show ? 'pointer-events-none' : ''}
      `}
      style={{ transitionDuration }}

      aria-hidden="true"
    >
      <img
        src={logo}
        alt="Logo"
        width={128}
        height={128}
        className="h-32 w-32 transition-opacity"
        style={{ transitionDuration }}
      />
      {/* Rotating dodecahedron – decorative loading animation */}
      <div className="mt-2" style={{ perspective: '500px' }}>
        <div className="poly-spin relative h-14 w-14">
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 13.9px, 33.0px 13.9px, 18.0px 3.0px, 8.7px 31.5px, 27.3px 31.5px)", transform: "matrix3d(1.0000,0.0000,0.0000,0.0000,0.0000,-0.5257,0.8507,0.0000,0.0000,-0.8507,-0.5257,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 20.6px, 33.0px 20.6px, 18.0px 31.5px, 8.7px 3.0px, 27.3px 3.0px)", transform: "matrix3d(1.0000,0.0000,0.0000,0.0000,0.0000,0.5257,0.8507,0.0000,0.0000,-0.8507,0.5257,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 20.6px, 33.0px 20.6px, 18.0px 31.5px, 8.7px 3.0px, 27.3px 3.0px)", transform: "matrix3d(1.0000,0.0000,0.0000,0.0000,0.0000,-0.5257,-0.8507,0.0000,0.0000,0.8507,-0.5257,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 13.9px, 33.0px 13.9px, 18.0px 3.0px, 8.7px 31.5px, 27.3px 31.5px)", transform: "matrix3d(1.0000,0.0000,0.0000,0.0000,0.0000,0.5257,-0.8507,0.0000,0.0000,0.8507,0.5257,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 13.9px, 33.0px 13.9px, 18.0px 3.0px, 8.7px 31.5px, 27.3px 31.5px)", transform: "matrix3d(0.0000,0.0000,1.0000,0.0000,-0.5257,0.8507,0.0000,0.0000,-0.8507,-0.5257,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 20.6px, 33.0px 20.6px, 18.0px 31.5px, 8.7px 3.0px, 27.3px 3.0px)", transform: "matrix3d(0.0000,0.0000,1.0000,0.0000,0.5257,0.8507,0.0000,0.0000,-0.8507,0.5257,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 20.6px, 33.0px 20.6px, 18.0px 31.5px, 8.7px 3.0px, 27.3px 3.0px)", transform: "matrix3d(0.0000,0.0000,1.0000,0.0000,-0.5257,-0.8507,0.0000,0.0000,0.8507,-0.5257,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 13.9px, 33.0px 13.9px, 18.0px 3.0px, 8.7px 31.5px, 27.3px 31.5px)", transform: "matrix3d(0.0000,0.0000,1.0000,0.0000,0.5257,-0.8507,0.0000,0.0000,0.8507,0.5257,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 13.9px, 33.0px 13.9px, 8.7px 31.5px, 27.3px 31.5px, 18.0px 3.0px)", transform: "matrix3d(0.0000,1.0000,0.0000,0.0000,0.8507,0.0000,-0.5257,0.0000,-0.5257,0.0000,-0.8507,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 20.6px, 33.0px 20.6px, 8.7px 3.0px, 27.3px 3.0px, 18.0px 31.5px)", transform: "matrix3d(0.0000,1.0000,0.0000,0.0000,0.8507,0.0000,0.5257,0.0000,0.5257,0.0000,-0.8507,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 20.6px, 33.0px 20.6px, 8.7px 3.0px, 27.3px 3.0px, 18.0px 31.5px)", transform: "matrix3d(0.0000,1.0000,0.0000,0.0000,-0.8507,0.0000,-0.5257,0.0000,-0.5257,0.0000,0.8507,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
          <div className="absolute left-1/2 top-1/2 border border-white/60 bg-white/40" style={{ width: 36.0, height: 34.5, marginLeft: -18.0, marginTop: -17.3, clipPath: "polygon(3.0px 13.9px, 33.0px 13.9px, 8.7px 31.5px, 27.3px 31.5px, 18.0px 3.0px)", transform: "matrix3d(0.0000,1.0000,0.0000,0.0000,-0.8507,0.0000,0.5257,0.0000,0.5257,0.0000,0.8507,0.0000,0.0000,0.0000,0.0000,1.0000) translateZ(20.6px)" }} />
        </div>
      </div>
      {/* Loading bar – reflects real data-loading progress */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="mt-4 w-64 max-w-[300px] h-1 bg-neutral-600 overflow-hidden rounded"
      >
        <div
          className="h-full bg-white transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}