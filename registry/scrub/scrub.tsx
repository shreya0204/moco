"use client";

import * as React from "react";
import "./scrub.css";

export type ScrubNumberProps = {
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Accessible label for the range input. */
  label: string;
  /** Formats the displayed value; defaults to String(value). */
  format?: (n: number) => string;
  /** The letter or word that doubles as the drag handle. */
  handle: string;
};

/**
 * A Tangle-style inline control: the variable itself is a drag handle, and a
 * compact range input sits inline with the text for pointer and keyboard use.
 */
export function ScrubNumber({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  format,
  handle,
}: ScrubNumberProps) {
  const id = React.useId();
  const drag = React.useRef<{ x: number; v: number } | null>(null);
  const text = format ? format(value) : String(value);

  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n / step) * step));

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, v: value };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const perPx = (max - min) / 320;
    onChange(clamp(drag.current.v + (e.clientX - drag.current.x) * perPx));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <span className="moco-scrub">
      <span
        className="moco-scrub-handle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-hidden="true"
      >
        {handle}
      </span>
      <label className="moco-sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="moco-scrub-mini"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${label}: ${text}`}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="moco-num">{text}</span>
    </span>
  );
}
