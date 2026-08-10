"use client";

import * as React from "react";
import "./scrolly.css";

export interface StepShape {
  key: string;
  caption: string;
  text: React.ReactNode;
}

export interface ScrollyStageProps<S extends StepShape> {
  steps: S[];
  render: (step: S, index: number, progress: number) => React.ReactNode;
  initial?: number;
}

/**
 * A figure that pins to the viewport while prose steps scroll past it.
 * Below 1024px it un-pins and each step renders its own static snapshot.
 * With JS off, every step is visible and the figure shows the final state
 * (add a `no-js` class to <html> and remove it with JS to get that fallback).
 */
export function ScrollyStage<S extends StepShape>({
  steps,
  render,
  initial = 0,
}: ScrollyStageProps<S>) {
  const [active, setActive] = React.useState(initial);
  const refs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.step);
          if (!Number.isNaN(i)) setActive(i);
        }
      },
      // Fire when a step crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  const current = steps[Math.min(active, steps.length - 1)];

  return (
    <div className="moco-scrolly">
      <div className="moco-scrolly-figure" aria-hidden="true">
        <div className="moco-plate">
          {render(current, active, active / Math.max(1, steps.length - 1))}
        </div>
        <p className="moco-step-cap">{current.caption}</p>
      </div>

      <div className="moco-scrolly-steps">
        {steps.map((s, i) => (
          <div
            key={s.key}
            data-step={i}
            data-on={i === active}
            className="moco-scrolly-step"
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            {/* Mobile / no-JS snapshot, above its own paragraph. */}
            <div className="moco-scrolly-inline">
              <div className="moco-plate">
                {render(s, i, i / Math.max(1, steps.length - 1))}
              </div>
              <p className="moco-step-cap">{s.caption}</p>
            </div>
            <div>{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
