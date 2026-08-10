"use client";

import * as React from "react";
import "./math.css";

/**
 * A display equation with a plain-English restatement under it and a
 * progressive-disclosure button for the derivation.
 *
 * `children` is the rendered equation — typically KaTeX or MathML output.
 * katex is not imported here; render the math however you like.
 */
export interface MathBlockProps {
  children: React.ReactNode;
  plain: string;
  derivation?: React.ReactNode;
}

export function MathBlock({ children, plain, derivation }: MathBlockProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  return (
    <div className="moco-math-block">
      {derivation ? (
        <div className="moco-math-head">
          <button
            type="button"
            className="moco-btn-sm"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Hide the math" : "Show the math"}
          </button>
        </div>
      ) : null}
      {children}
      <p className="moco-math-plain">{plain}</p>
      {derivation ? (
        <div id={id} className="moco-math-deriv" hidden={!open}>
          {derivation}
        </div>
      ) : null}
    </div>
  );
}
