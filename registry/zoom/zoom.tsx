"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import "./zoom.css";

export interface ZoomProps {
  children: React.ReactNode;
  caption?: React.ReactNode;
}

/** Lightbox affordance. Esc and click-outside close it. */
export function Zoom({ children, caption }: ZoomProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const opener = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={opener}
        type="button"
        className="moco-plate-zoom"
        aria-label="Enlarge this figure"
        onClick={() => setOpen(true)}
      >
        ⤢
      </button>
      {children}
      {mounted && open
        ? createPortal(
            <div
              className="moco-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Enlarged figure"
              onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            >
              <div className="moco-lightbox-inner">
                {children}
                {caption ? <figcaption className="moco-cap">{caption}</figcaption> : null}
                <button
                  type="button"
                  className="moco-btn-sm"
                  style={{ marginTop: "1rem" }}
                  onClick={() => setOpen(false)}
                >
                  Close (Esc)
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
