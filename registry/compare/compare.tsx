"use client";

import * as React from "react";
import "./compare.css";

export interface CompareProps {
  before: React.ReactNode;
  after: React.ReactNode;
  height?: number;
  beforeLabel?: string;
  afterLabel?: string;
}

/**
 * Before/after wipe. Works for images and for live DOM. Drag the handle,
 * click anywhere to position it, or focus it and use the arrow keys.
 */
export function Compare({
  before,
  after,
  height = 300,
  beforeLabel = "before",
  afterLabel = "after",
}: CompareProps) {
  const [pct, setPct] = React.useState(50);
  const box = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const setFromClientX = (x: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={box}
      className="moco-cmp"
      style={{ height }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <span className="moco-cmp-label" style={{ left: 12 }}>
        {beforeLabel}
      </span>
      <span className="moco-cmp-label" style={{ right: 12 }}>
        {afterLabel}
      </span>

      <div style={{ position: "absolute", inset: 0 }}>{before}</div>
      <div className="moco-cmp-after" style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
        {after}
      </div>

      <div className="moco-cmp-handle" style={{ left: `${pct}%` }}>
        <button
          type="button"
          className="moco-cmp-grab"
          role="slider"
          aria-label={`Reveal ${afterLabel} over ${beforeLabel}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-valuetext={`${Math.round(pct)} percent`}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPct((v) => Math.max(0, v - 4));
            if (e.key === "ArrowRight") setPct((v) => Math.min(100, v + 4));
            if (e.key === "Home") setPct(0);
            if (e.key === "End") setPct(100);
          }}
        >
          ⇄
        </button>
      </div>
    </div>
  );
}
