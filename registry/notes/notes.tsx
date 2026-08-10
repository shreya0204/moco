"use client";

import * as React from "react";
import "./notes.css";

/**
 * Tufte-style margin note. Numbering comes from a CSS counter, so it is always
 * document order with no registration bookkeeping. On screens ≥1280px it sits
 * in the right gutter; below that it collapses to a tap-to-expand disclosure.
 * There is no jump-to-bottom footnote anywhere.
 *
 * Wrap your prose column in `.moco-notes-scope` — it initializes the counter
 * and is the positioned ancestor the margin notes hang off.
 */
export interface NoteProps {
  children: React.ReactNode;
}

/* Margin notes are absolutely positioned at their anchor's line, so two notes
   anchored close together would overlap in the gutter. After layout, walk the
   scope's notes in document order and push each below the previous one.
   Idempotent: safe to run from every note on mount, resize, or font load. */
function relayoutScope(scope: Element) {
  const notes = scope.querySelectorAll<HTMLElement>(".moco-sidenote-wrap");
  let prevBottom = -Infinity;
  notes.forEach((n) => {
    n.style.removeProperty("--moco-note-shift");
    const r = n.getBoundingClientRect();
    const shift = Math.max(0, prevBottom + 10 - r.top);
    if (shift > 0) n.style.setProperty("--moco-note-shift", `${shift}px`);
    prevBottom = Math.max(prevBottom, r.top + shift + r.height);
  });
}

function useNoteLayout(ref: React.RefObject<HTMLElement | null>) {
  React.useLayoutEffect(() => {
    const scope = ref.current?.closest(".moco-notes-scope");
    if (!scope) return;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => relayoutScope(scope));
    };
    schedule();
    document.fonts?.ready.then(schedule).catch(() => {});
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);
}

export function Note({ children }: NoteProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const wrap = React.useRef<HTMLSpanElement>(null);
  useNoteLayout(wrap);
  return (
    <span className="moco-note">
      <span className="moco-noteref" aria-hidden="true" />
      <span className="moco-sidenote-wrap" ref={wrap}>
        <button
          type="button"
          className="moco-sidenote-toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="moco-sidenote-num" /> {open ? "hide note" : "note"}
        </button>
        <span id={id} className="moco-sidenote moco-sidenote-body" data-open={open}>
          <span className="moco-sidenote-num moco-desktop-only" aria-hidden="true" />
          {children}
        </span>
      </span>
    </span>
  );
}

/**
 * Dotted-underline term revealing a definition in a popover.
 *
 * The popover anchors left by default and flips to anchor right when the term
 * sits in the right half of the viewport, so it can never run off the edge.
 * CSS alone can't do this — it doesn't know where the inline box landed.
 */
export interface TermProps {
  children: React.ReactNode;
  def: React.ReactNode;
}

export function Term({ children, def }: TermProps) {
  const id = React.useId();
  const ref = React.useRef<HTMLSpanElement>(null);
  const [flip, setFlip] = React.useState(false);

  const measure = () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setFlip(r.left + r.width / 2 > window.innerWidth / 2);
  };

  return (
    <span
      ref={ref}
      className="moco-term"
      tabIndex={0}
      aria-describedby={id}
      onPointerEnter={measure}
      onFocus={measure}
    >
      {children}
      <span className="moco-term-pop" id={id} role="tooltip" data-flip={flip}>
        {def}
      </span>
    </span>
  );
}
