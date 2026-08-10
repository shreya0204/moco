import * as React from "react";
import "./cover.css";

/**
 * Deterministic generative cover art. The same seed always draws the same
 * SVG — hashing is FNV-1a, randomness is a seeded PRNG, never Math.random.
 * Three variants: curves, blocks, bars. Strokes are non-scaling, so the same
 * artwork reads at 640px and at 150px.
 */

const W = 640;
const H = 280;

export interface CoverProps {
  /** Usually the post slug. The same seed always draws the same cover. */
  seed: string;
  alt: string;
  /** Force a variant (0 curves, 1 blocks, 2 bars). Defaults to seed-derived. */
  variant?: 0 | 1 | 2;
  className?: string;
}

/** FNV-1a. Stable across builds, unlike anything involving Math.random. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — tiny seeded PRNG, deterministic across engines. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* One accent stroke per composition; supporting strokes stay quiet. */
const TONES = ["var(--moco-faint)", "var(--moco-warn)", "var(--moco-ink)"];
const DASHES = ["2 4", "7 5", "12 4 3 4"];

/** Smooth open path through points via quadratic midpoint segments. */
function smoothPath(pts: [number, number][]): string {
  const d = [`M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`];
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const mx = (x + pts[i + 1][0]) / 2;
    const my = (y + pts[i + 1][1]) / 2;
    d.push(`Q${x.toFixed(1)},${y.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`);
  }
  const last = pts[pts.length - 1];
  d.push(`L${last[0].toFixed(1)},${last[1].toFixed(1)}`);
  return d.join(" ");
}

/** Variant 0 — gridlines and a family of drifting curves, one in accent. */
function Curves({ seed }: { seed: number }) {
  const r = rng(seed);
  const rules = 3 + (seed % 3);
  const curves = 3 + Math.floor(r() * 2); // 3–4 quiet curves + 1 accent
  const steps = 9;

  const makeCurve = (drift: number) => {
    let y = 56 + r() * (H - 140);
    const pts: [number, number][] = [];
    for (let i = 0; i < steps; i++) {
      pts.push([32 + ((W - 64) * i) / (steps - 1), y]);
      y += (r() - 0.5 + drift) * 44;
      y = Math.min(H - 40, Math.max(36, y));
    }
    return pts;
  };

  const accent = makeCurve(0.28); // the accent curve trends down-right

  return (
    <>
      {Array.from({ length: rules }, (_, i) => {
        const y = 36 + ((H - 72) * (i + 1)) / (rules + 1);
        return (
          <line
            key={i}
            x1={32}
            x2={W - 32}
            y1={y}
            y2={y}
            stroke="var(--moco-line)"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {Array.from({ length: curves }, (_, i) => (
        <path
          key={i}
          d={smoothPath(makeCurve((r() - 0.5) * 0.3))}
          fill="none"
          stroke={TONES[i % TONES.length]}
          strokeWidth={1.25}
          strokeDasharray={DASHES[i % DASHES.length]}
          opacity={0.7}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={smoothPath(accent)}
        fill="none"
        stroke="var(--moco-accent-dk)"
        strokeWidth={2.25}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={accent[accent.length - 1][0]}
        cy={accent[accent.length - 1][1]}
        r="4"
        fill="var(--moco-accent-dk)"
      />
    </>
  );
}

/** Variant 1 — rows of proportional blocks with one diamond breakpoint each. */
function Blocks({ seed }: { seed: number }) {
  const r = rng(seed ^ 0x9e3779b9);
  const rows = 4;
  const gap = 10;
  const rowH = 32;
  const top = (H - (rows * rowH + (rows - 1) * 20)) / 2;
  const count = 4 + (seed % 2);
  const widths = Array.from({ length: count }, () => 0.5 + r());
  const total = widths.reduce((a, b) => a + b, 0);
  const inner = W - 64;

  return (
    <>
      {Array.from({ length: rows }, (_, row) => {
        const y = top + row * (rowH + 20);
        const cut = ((seed >> (row * 2)) % (count - 1)) + 1;
        let x = 32;
        const marks: React.ReactNode[] = [];
        widths.forEach((w, i) => {
          const bw = ((inner - gap * (count - 1)) * w) / total;
          marks.push(
            <rect
              key={i}
              x={x}
              y={y}
              width={bw}
              height={rowH}
              rx="2"
              fill={i < cut ? "var(--moco-accent-dk)" : "none"}
              stroke={i < cut ? "var(--moco-accent-dk)" : "var(--moco-line)"}
              strokeDasharray={i >= cut + 1 ? "5 5" : undefined}
              opacity={i < cut ? 1 - row * 0.17 : 1}
              vectorEffect="non-scaling-stroke"
            />,
          );
          if (i === cut - 1) {
            const cx = x + bw + gap / 2;
            marks.push(
              <rect
                key={`d${i}`}
                x={cx - 5}
                y={y + rowH / 2 - 5}
                width="10"
                height="10"
                fill="var(--moco-bg)"
                stroke="var(--moco-accent-dk)"
                transform={`rotate(45 ${cx} ${y + rowH / 2})`}
                vectorEffect="non-scaling-stroke"
              />,
            );
          }
          x += bw + gap;
        });
        return <g key={row}>{marks}</g>;
      })}
    </>
  );
}

/** Variant 2 — paired bars: a full outline bar over a shorter accent bar,
 *  with a dashed bracket spanning the difference. */
function Bars({ seed }: { seed: number }) {
  const r = rng(seed ^ 0x85ebca6b);
  const groups = 3;
  const barH = 20;
  const inner = W - 64;
  const pairGap = 10;
  const groupGap = 26;
  const groupH = barH * 2 + pairGap;
  const top = (H - (groups * groupH + (groups - 1) * groupGap)) / 2;

  return (
    <>
      {Array.from({ length: groups }, (_, gi) => {
        const gy = top + gi * (groupH + groupGap);
        const full = inner * (0.82 + r() * 0.18);
        const kept = full * (0.2 + r() * 0.4);
        const split = 0.35 + r() * 0.35; // solid/dashed split inside each bar
        const rowFor = (len: number, y: number, on: boolean) => {
          const solid = len * split;
          return (
            <g key={y}>
              <rect
                x={32}
                y={y}
                width={Math.max(solid, 2)}
                height={barH}
                rx="2"
                fill={on ? "var(--moco-accent-dk)" : "none"}
                stroke={on ? "var(--moco-accent-dk)" : "var(--moco-line)"}
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={32 + solid + 3}
                y={y}
                width={Math.max(len - solid - 3, 2)}
                height={barH}
                rx="2"
                fill="none"
                stroke={on ? "var(--moco-accent-dk)" : "var(--moco-line)"}
                strokeDasharray="5 5"
                opacity={0.8}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        };
        return (
          <g key={gi}>
            {rowFor(full, gy, false)}
            {rowFor(kept, gy + barH + pairGap, true)}
            <line
              x1={32 + kept}
              x2={32 + full}
              y1={gy + groupH + 6}
              y2={gy + groupH + 6}
              stroke="var(--moco-accent-dk)"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </>
  );
}

const VARIANTS = [Curves, Blocks, Bars];

export function Cover({ seed, alt, variant, className }: CoverProps) {
  const h = hash(seed);
  const Art = VARIANTS[variant ?? h % VARIANTS.length];
  return (
    <svg
      className={`moco-cover${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      role={alt ? "img" : "presentation"}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <rect width={W} height={H} fill="var(--moco-panel)" />
      <Art seed={h} />
    </svg>
  );
}
