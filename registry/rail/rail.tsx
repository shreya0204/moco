"use client";

import * as React from "react";
import "./rail.css";
import { useScrollspy, smoothScrollTo } from "@/components/moco/hooks";

export interface Heading {
  id: string;
  text: string;
  level?: number;
}

export interface RailProps {
  headings: Heading[];
}

/** Left-edge minimap: one tick per H2. Hidden below 1280px. */
export function Rail({ headings }: RailProps) {
  const ids = React.useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useScrollspy(ids);
  if (!headings.length) return null;

  return (
    <nav className="moco-rail" aria-label="Sections">
      {headings.map((h, i) => (
        <button
          key={h.id}
          type="button"
          className="moco-rail-item"
          aria-current={i === active}
          aria-label={`Jump to ${h.text}`}
          onClick={() => smoothScrollTo(h.id)}
        >
          <span className="moco-rail-tick" aria-hidden="true" />
          <span className="moco-rail-label" aria-hidden="true">
            {h.text}
          </span>
        </button>
      ))}
    </nav>
  );
}
