"use client";

import * as React from "react";

/** Tabs sit bottom-right and crossfade between versions of the same snippet. */
export function CodeTabsClient({
  labels,
  filenames,
  panes,
}: {
  labels: string[];
  filenames: string[];
  panes: React.ReactNode[];
}) {
  const [i, setI] = React.useState(0);
  return (
    <div className="moco-win">
      <div className="moco-win-bar">
        <span>{filenames[i]}</span>
      </div>
      <div className="moco-win-body" key={i}>
        <div className="moco-win-fade">{panes[i]}</div>
      </div>
      {labels.length > 1 ? (
        <div className="moco-win-tabs" role="tablist" aria-label="Snippet versions">
          {labels.map((l, j) => (
            <button
              key={l}
              type="button"
              role="tab"
              className="moco-pill"
              aria-selected={i === j}
              aria-pressed={i === j}
              onClick={() => setI(j)}
            >
              {l}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ───────────────── annotated walkthrough with linked highlighting ──────────────── */

export interface Region {
  id: string;
  label: string;
  note: React.ReactNode;
}

export function WalkthroughClient({
  filename,
  regions,
  panes,
  blocks,
}: {
  filename: string;
  regions: Region[];
  /** Highlighted markup for each region, same order as `regions`. */
  panes: React.ReactNode[];
  /** The adjacent diagram, keyed by the same region ids. */
  blocks: { id: string; label: string; sub?: string }[];
}) {
  const [hover, setHover] = React.useState<string | null>(null);
  const [pinned, setPinned] = React.useState<string | null>(null);
  const active = pinned ?? hover;

  const dim = (id: string) => (active != null && active !== id ? "true" : undefined);

  return (
    <div className="moco-walk">
      <div className="moco-win">
        <div className="moco-win-bar">
          <span>{filename}</span>
          {pinned ? (
            <button type="button" className="moco-btn-sm" onClick={() => setPinned(null)}>
              unpin
            </button>
          ) : null}
        </div>
        <div className="moco-win-body">
          {regions.map((r, i) => (
            <div
              key={r.id}
              className="moco-walk-region"
              data-on={active === r.id}
              data-dim={dim(r.id)}
              tabIndex={0}
              role="button"
              aria-pressed={pinned === r.id}
              aria-label={`${r.label} — ${pinned === r.id ? "pinned" : "click to pin"}`}
              onMouseEnter={() => setHover(r.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(r.id)}
              onBlur={() => setHover(null)}
              onClick={() => setPinned((p) => (p === r.id ? null : r.id))}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setPinned((p) => (p === r.id ? null : r.id));
                }
              }}
            >
              {panes[i]}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="moco-dgm" style={{ minWidth: 0, marginBottom: "1.25rem" }}>
          <div className="moco-dgm-track" style={{ flexWrap: "wrap" }}>
            {blocks.map((b) => (
              <button
                key={b.id}
                type="button"
                className="moco-dgm-block"
                data-variant={active === b.id ? "active" : "default"}
                data-dim={dim(b.id)}
                style={{ flexBasis: "45%" }}
                onMouseEnter={() => setHover(b.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(b.id)}
                onBlur={() => setHover(null)}
                onClick={() => setPinned((p) => (p === b.id ? null : b.id))}
              >
                <span className="moco-b-label">{b.label}</span>
                {b.sub ? <span className="moco-b-sub">{b.sub}</span> : null}
              </button>
            ))}
          </div>
        </div>

        {regions.map((r) => (
          <button
            key={r.id}
            type="button"
            className="moco-walk-note"
            data-on={active === r.id}
            data-dim={dim(r.id)}
            onMouseEnter={() => setHover(r.id)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(r.id)}
            onBlur={() => setHover(null)}
            onClick={() => setPinned((p) => (p === r.id ? null : r.id))}
          >
            <b>{r.label}</b>
            {r.note}
          </button>
        ))}
      </div>
    </div>
  );
}
