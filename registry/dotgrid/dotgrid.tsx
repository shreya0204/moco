"use client";

import * as React from "react";
import { useReducedMotion } from "@/components/moco/hooks";
import "./dotgrid.css";

export interface DotGridProps {
  /** Grid pitch in px. */
  spacing?: number;
  /** Cursor influence radius in px. */
  radius?: number;
}

const TAU = Math.PI * 2;

/**
 * Sparse dot grid that reacts to the cursor. Pauses when the tab is hidden and
 * does not run at all under prefers-reduced-motion. Dot color is resolved from
 * the canvas's computed `color` (set to var(--moco-ink) in dotgrid.css), so it
 * stays visible in dark mode; only the alpha ramp is applied on top. Dots
 * brighten and grow as the cursor nears them.
 */
export function DotGrid({ spacing = 34, radius = 130 }: DotGridProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let running = true;

    // Base dot color, re-resolved on color-scheme change and resize.
    let rgb = "0,0,0";
    const resolveColor = () => {
      const m = getComputedStyle(canvas).color.match(/[\d.]+/g);
      if (m && m.length >= 3) rgb = `${m[0]},${m[1]},${m[2]}`;
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resolveColor();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = spacing / 2; y < h; y += spacing) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          const k = d < radius ? 1 - d / radius : 0;
          const alpha = 0.16 + k * 0.44;
          const pull = k * 5;
          const px = x - (d ? (dx / d) * pull : 0);
          const py = y - (d ? (dy / d) * pull : 0);
          ctx.fillStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(px, py, 1 + k * 0.9, 0, TAU);
          ctx.fill();
        }
      }
      if (running) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", resolveColor);

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      scheme.removeEventListener("change", resolveColor);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [spacing, radius, reduced]);

  return <canvas ref={ref} className="moco-dotgrid" aria-hidden="true" />;
}
