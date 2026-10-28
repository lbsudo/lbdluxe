import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/components/global/constants/theme/use-themes';

interface MatrixBackgroundProps {
  color?: string;
  fontSize?: number;
  className?: string;
  speed?: number;
}

interface Column {
  y: number;
  speed: number;
  chars: string[];
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  color,
  fontSize = 14,
  className = '',
  speed = 1,
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const colsRef = useRef<Column[]>([]);

  const effectiveColor = color ?? (theme === 'dark' ? '#ffffff' : '#1F1F1F');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+';

    const TRAIL = 14;

    const seed = (w: number, h: number) => {
      const columns = Math.max(1, Math.floor(w / fontSize));
      colsRef.current = Array.from({ length: columns }, () => ({
        y: -Math.random() * (h / fontSize + 20), // staggered start above the screen
        speed: speed * (0.5 + Math.random() * 0.8), // per-column speed variance
        chars: Array.from({ length: TRAIL }, () =>
          chars[Math.floor(Math.random() * chars.length)],
        ),
      }));
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      // Draw in CSS pixels; the scale handles the device pixel ratio.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Trail fade: paint a translucent black over the whole canvas each frame
      // so previous glyphs dim, producing the comet-tail look.
      ctx.fillStyle = theme === 'dark' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px monospace`;
      ctx.textBaseline = 'top';

      const cols = colsRef.current;
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        col.y += col.speed;

        const headY = col.y * fontSize;

        // Reset once the column has fallen off the bottom, with a random
        // re-entry offset so columns don't re-enter in lockstep.
        if (headY > h + TRAIL * fontSize) {
          col.y = -Math.random() * (h / fontSize * 0.4 + 10);
          col.speed = speed * (0.5 + Math.random() * 0.8);
          // Re-roll the trail glyphs so the next pass isn't identical.
          for (let t = 0; t < TRAIL; t++) {
            col.chars[t] = chars[Math.floor(Math.random() * chars.length)];
          }
        }

        // Draw the head (bright), then the fading tail behind it.
        const headChar = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = effectiveColor;
        ctx.fillText(headChar, i * fontSize, headY);

        for (let t = 1; t < TRAIL; t++) {
          const alpha = (1 - t / TRAIL) * (theme === 'dark' ? 0.5 : 0.4);
          ctx.fillStyle = theme === 'dark'
            ? `rgba(255, 255, 255, ${alpha.toFixed(3)})`
            : `rgba(31, 41, 88, ${alpha.toFixed(3)})`;
          ctx.fillText(col.chars[t], i * fontSize, headY - t * fontSize);
        }
      }
    };

    const animate = () => {
      draw();
      requestRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (prefersReducedMotion) {
        draw();
        return;
      }
      if (requestRef.current == null) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    const stop = () => {
      if (requestRef.current != null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibility);
      stop();
    };
  }, [effectiveColor, fontSize, speed, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none z-0 ${className}`}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};

export default MatrixBackground;