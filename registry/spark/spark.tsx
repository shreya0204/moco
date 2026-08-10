import * as React from "react";
import "./spark.css";

export type SparkTone = "accent" | "warn" | "faint";

const TONE: Record<SparkTone, string> = {
  accent: "var(--moco-accent-dk)",
  warn: "var(--moco-warn)",
  faint: "var(--moco-faint)",
};

export interface SparkProps {
  data: number[];
  w?: number;
  h?: number;
  dot?: boolean;
  tone?: SparkTone;
  label?: string;
}

/**
 * Inline sparklines. ~60×16, sits on the text baseline, no axes, no labels.
 * These are punctuation, not charts.
 */
export function Spark({ data, w = 60, h = 16, dot = true, tone = "accent", label }: SparkProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const x = (i: number) => (i / (data.length - 1)) * (w - 2) + 1;
  const y = (v: number) => h - 2 - ((v - min) / span) * (h - 4);
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");

  return (
    <svg
      className="moco-spark"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label ?? `sparkline, ${data.length} points, ${min.toFixed(2)} to ${max.toFixed(2)}`}
    >
      <path d={d} fill="none" stroke={TONE[tone]} strokeWidth="1" />
      {dot ? (
        <circle
          cx={x(data.length - 1)}
          cy={y(data[data.length - 1])}
          r="1.6"
          fill={TONE[tone]}
        />
      ) : null}
    </svg>
  );
}

export interface SparkBarProps {
  value: number;
  max?: number;
  w?: number;
  h?: number;
  tone?: SparkTone;
  label?: string;
}

/** A tiny inline proportion bar. */
export function SparkBar({ value, max = 1, w = 60, h = 8, tone = "accent", label }: SparkBarProps) {
  const k = Math.max(0, Math.min(1, value / max));
  return (
    <svg
      className="moco-spark"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label ?? `${Math.round(k * 100)} percent`}
    >
      <rect x="0" y={h / 2 - 2} width={w} height="4" fill="var(--moco-line)" />
      <rect x="0" y={h / 2 - 2} width={w * k} height="4" fill={TONE[tone]} />
    </svg>
  );
}
