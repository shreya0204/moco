"use client";

import * as React from "react";
import "./island.css";
import {
  useReadProgress,
  useScrollspy,
  useReducedMotion,
  smoothScrollTo,
} from "@/components/moco/hooks";

export interface Heading {
  id: string;
  text: string;
  level?: number;
}

export interface IslandLink {
  label: string;
  href: string;
}

export interface IslandProps {
  title: string;
  headings: Heading[];
  /** Minutes. Shown at the top and counted down by the progress ring. */
  readingTime: number;
  /** Home / wordmark link shown while reading. */
  brand: IslandLink;
  /** Extra links listed under "Elsewhere" in the section menu. */
  links: IslandLink[];
  /** "Read next →" target. The end phase is skipped when absent. */
  next?: IslandLink | null;
  /** CSS selector for the article element progress is measured against. */
  articleSelector?: string;
}

/**
 * The morphing header island. Compact at scroll 0; expands to reveal the post
 * title, a scrollspy section name and a progress ring as you read; morphs once
 * more into "Read next →" at the end.
 */
export function Island({
  title,
  headings,
  readingTime,
  brand,
  links,
  next,
  articleSelector = "#article-root",
}: IslandProps) {
  const ids = React.useMemo(() => headings.map((h) => h.id), [headings]);
  const progress = useReadProgress(articleSelector);
  const active = useScrollspy(ids);
  const reduced = useReducedMotion();

  const [open, setOpen] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  const [width, setWidth] = React.useState<number | undefined>();
  const inner = React.useRef<HTMLDivElement>(null);
  const shell = React.useRef<HTMLDivElement>(null);

  const phase: "top" | "reading" | "end" =
    progress <= 0.02 ? "top" : progress >= 0.94 && next ? "end" : "reading";

  // Re-measure the content and animate the shell to it.
  React.useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setWidth(el.scrollWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phase, active, title, next]);

  // Slide + fade the swapped text in.
  React.useEffect(() => {
    if (reduced) {
      setEntered(true);
      return;
    }
    setEntered(false);
    const t = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(t);
  }, [phase, reduced]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!shell.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const left = Math.max(1, Math.ceil(readingTime * (1 - progress)));
  const section = headings[active]?.text;

  return (
    <div
      ref={shell}
      className="moco-island"
      style={reduced ? undefined : { width }}
      role="navigation"
      aria-label="Article navigation"
    >
      <div ref={inner} className="moco-island-in">
        <div className="moco-island-slot" data-enter={entered}>
          {phase === "end" && next ? (
            <a href={next.href} className="moco-island-title">
              Read next → {next.label}
            </a>
          ) : (
            <>
              <a href={brand.href}>
                {brand.label} <span aria-hidden="true">↑</span>
              </a>

              {phase === "top" ? (
                <>
                  <span className="moco-island-sep" aria-hidden="true">
                    |
                  </span>
                  <span className="moco-island-section">{readingTime} min read</span>
                </>
              ) : (
                <>
                  <span className="moco-island-sep" aria-hidden="true">
                    |
                  </span>
                  <button
                    type="button"
                    className="moco-island-title"
                    aria-expanded={open}
                    aria-haspopup="menu"
                    onClick={() => setOpen((v) => !v)}
                  >
                    {title} <span aria-hidden="true">⌄</span>
                  </button>
                  {section ? (
                    <>
                      <span className="moco-island-sep moco-hide-sm" aria-hidden="true">
                        ›
                      </span>
                      <span className="moco-island-section moco-hide-sm">{section}</span>
                    </>
                  ) : null}
                </>
              )}
            </>
          )}
        </div>

        <Ring progress={progress} label={`${left}m`} />
      </div>

      {open ? (
        <div className="moco-island-menu" role="menu" aria-label="Sections and site links">
          <p className="moco-menu-head">In this essay</p>
          {headings.map((h, i) => (
            <button
              key={h.id}
              type="button"
              role="menuitem"
              aria-current={i === active}
              onClick={() => {
                setOpen(false);
                smoothScrollTo(h.id);
              }}
            >
              {h.text}
            </button>
          ))}
          {links.length ? (
            <>
              <hr />
              <p className="moco-menu-head">Elsewhere</p>
              {links.map((l) => (
                <a key={l.href} href={l.href} role="menuitem" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Ring({ progress, label }: { progress: number; label: string }) {
  const r = 12;
  const c = 2 * Math.PI * r;
  return (
    <span
      className="moco-ring"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuetext={`${Math.round(progress * 100)} percent read, about ${label} left`}
    >
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="15" r={r} fill="none" stroke="var(--moco-line)" strokeWidth="1" />
        <circle
          cx="15"
          cy="15"
          r={r}
          fill="none"
          stroke="var(--moco-accent-dk)"
          strokeWidth="1.5"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <span className="moco-ring-time">{label}</span>
    </span>
  );
}
