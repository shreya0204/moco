"use client";

import * as React from "react";
import "./stepper.css";
import { useInView, useReducedMotion } from "@/components/moco/hooks";

export interface StepperStep {
  key: string;
  caption: string;
}

export interface StepperProps {
  steps: StepperStep[];
  render: (i: number) => React.ReactNode;
  /** Accessible name for the stepper group. */
  ariaLabel: string;
}

/**
 * Generic state-machine stepper. Auto-play never starts on its own — it needs
 * a click — and it stops when the component scrolls out of view.
 */
export function Stepper({ steps, render, ariaLabel }: StepperProps) {
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: false, rootMargin: "0px" });
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (!playing || !visible || reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % steps.length), 1600);
    return () => clearInterval(t);
  }, [playing, visible, reduced, steps.length]);

  React.useEffect(() => {
    if (!visible) setPlaying(false);
  }, [visible]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          setPlaying(false);
          setI((v) => Math.min(steps.length - 1, v + 1));
        }
        if (e.key === "ArrowLeft") {
          setPlaying(false);
          setI((v) => Math.max(0, v - 1));
        }
      }}
    >
      <div key={i} className="moco-win-fade">
        {render(i)}
      </div>

      <p className="moco-step-cap" aria-live="polite">
        {steps[i].caption}
      </p>

      <div className="moco-step-bar">
        <button
          type="button"
          className="moco-step-btn"
          aria-label="Previous step"
          disabled={i === 0}
          onClick={() => {
            setPlaying(false);
            setI((v) => Math.max(0, v - 1));
          }}
        >
          ◀
        </button>
        <button
          type="button"
          className="moco-step-btn"
          aria-label="Next step"
          disabled={i === steps.length - 1}
          onClick={() => {
            setPlaying(false);
            setI((v) => Math.min(steps.length - 1, v + 1));
          }}
        >
          ▶
        </button>
        <span>
          {i + 1} / {steps.length}
        </span>
        {reduced ? null : (
          <button
            type="button"
            className="moco-step-btn"
            aria-label={playing ? "Pause" : "Play"}
            aria-pressed={playing}
            onClick={() => setPlaying((v) => !v)}
          >
            {playing ? "❙❙" : "▶"}
          </button>
        )}
      </div>
    </div>
  );
}
