"use client";

import * as React from "react";
import "./palette.css";
import { smoothScrollTo } from "@/components/moco/hooks";

export interface IndexEntry {
  kind: "post" | "page" | "section";
  label: string;
  href?: string;
  id?: string;
}

export interface PaletteProps {
  index: IndexEntry[];
  /** Headings scraped into the index each time the palette opens. */
  sectionSelector?: string;
  /** Called for entries with an href. Defaults to a full navigation. */
  onNavigate?: (href: string) => void;
}

/** Subsequence match. Returns matched character indices, or null. */
function fuzzy(needle: string, hay: string): number[] | null {
  if (!needle) return [];
  const h = hay.toLowerCase();
  const n = needle.toLowerCase();
  const hits: number[] = [];
  let i = 0;
  for (const ch of n) {
    const at = h.indexOf(ch, i);
    if (at === -1) return null;
    hits.push(at);
    i = at + 1;
  }
  return hits;
}

function Highlighted({ text, hits }: { text: string; hits: number[] }) {
  const set = new Set(hits);
  return (
    <span>
      {text.split("").map((c, i) => (set.has(i) ? <mark key={i}>{c}</mark> : <span key={i}>{c}</span>))}
    </span>
  );
}

/** ⌘K / Ctrl-K. Traps focus while open, restores it on close. */
export function Palette({
  index,
  sectionSelector = ".prose h2[id]",
  onNavigate,
}: PaletteProps) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const [sections, setSections] = React.useState<IndexEntry[]>([]);
  const restore = React.useRef<HTMLElement | null>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const box = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open) {
      restore.current?.focus();
      return;
    }
    restore.current = document.activeElement as HTMLElement;
    setQ("");
    setSel(0);
    setSections(
      Array.from(document.querySelectorAll<HTMLElement>(sectionSelector)).map((h) => ({
        kind: "section" as const,
        label: h.textContent ?? "",
        id: h.id,
      })),
    );
    const t = setTimeout(() => input.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open, sectionSelector]);

  const all = React.useMemo(() => [...sections, ...index], [sections, index]);

  const results = React.useMemo(() => {
    return all
      .map((e) => ({ e, hits: fuzzy(q, e.label) }))
      .filter((r): r is { e: IndexEntry; hits: number[] } => r.hits !== null)
      .slice(0, 40);
  }, [all, q]);

  const go = (e: IndexEntry) => {
    setOpen(false);
    if (e.kind === "section" && e.id) smoothScrollTo(e.id);
    else if (e.href) (onNavigate ?? ((href: string) => location.assign(href)))(e.href);
  };

  if (!open) return null;

  return (
    <div
      className="moco-cmdk-scrim"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div
        ref={box}
        className="moco-cmdk"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSel((v) => Math.min(results.length - 1, v + 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setSel((v) => Math.max(0, v - 1));
          }
          if (e.key === "Enter" && results[sel]) {
            e.preventDefault();
            go(results[sel].e);
          }
          if (e.key === "Tab") {
            // Focus stays in the input; there is nowhere else to go.
            e.preventDefault();
          }
        }}
      >
        <input
          ref={input}
          value={q}
          placeholder="Jump to a post, a section, a page…"
          aria-label="Search posts and sections"
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
        />
        {results.length ? (
          <ul role="listbox" aria-label="Results">
            {results.map((r, i) => (
              <li key={`${r.e.kind}-${r.e.label}-${i}`} role="option" aria-selected={i === sel}>
                <button type="button" onMouseEnter={() => setSel(i)} onClick={() => go(r.e)}>
                  <Highlighted text={r.e.label} hits={r.hits} />
                  <span className="moco-kind">{r.e.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="moco-empty">Nothing matches “{q}”.</div>
        )}
      </div>
    </div>
  );
}
