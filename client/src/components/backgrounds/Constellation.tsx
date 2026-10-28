'use client';
import React, { useRef, useEffect } from 'react';
import { useTheme } from '@/components/global/constants/theme/use-themes';

interface ConstellationProps {
  /** Number of drifting nodes. */
  nodeCount?: number;
  /** Max distance (px) at which two nodes are joined by a line. */
  linkDistance?: number;
  /** Drift speed multiplier. */
  speed?: number;
  /** Line color. Defaults per theme. */
  color?: string;
  /** Node color. Defaults per theme. */
  nodeColor?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const Constellation: React.FC<ConstellationProps> = ({
  nodeCount = 60,
  linkDistance = 115,
  speed = 1,
  color,
  nodeColor,
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  const effectiveColor = color ?? (theme === 'dark' ? 'rgba(185,198,255,' : 'rgba(31,41,88,');
  const effectiveNodeColor = nodeColor ?? (theme === 'dark' ? 'rgba(232,240,255,0.9)' : 'rgba(15,23,42,0.85)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Seed a fresh network. Node count scales with viewport area so phones
    // don't render the same density as a 4K display.
    const seed = (w: number, h: number) => {
      const count = Math.round(
        Math.max(28, Math.min(nodeCount, (w * h) / 26000)),
      );
      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32 * speed,
        vy: (Math.random() - 0.5) * 0.32 * speed,
        r: Math.random() * 1.5 + 0.6,
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
      sizeRef.current = { w, h };
      seed(w, h);
    };

    const draw = () => {
      const { w, h } = sizeRef.current;
      const nodes = nodesRef.current;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Join nearby nodes. Alpha falls off with distance so the network
      // fades out softly instead of clipping at a hard radius.
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < linkDistance) {
            const alpha = 0.3 * (1 - d / linkDistance);
            ctx.strokeStyle = `${effectiveColor}${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = effectiveNodeColor;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      draw();
      requestRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (prefersReducedMotion) {
        // Respect the user's preference: render one static frame, don't animate.
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

    // Don't burn CPU/battery animating a canvas nobody can see.
    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
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
  }, [nodeCount, linkDistance, speed, effectiveColor, effectiveNodeColor]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none z-0"
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

export default Constellation;