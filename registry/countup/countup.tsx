"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "@/components/moco/hooks";
import "./countup.css";

const groupedInt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const compactNum = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const percentNum = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

/**
 * Built-in formatters, named so the component works from server-rendered
 * prose where a function prop cannot cross the RSC boundary. Client callers
 * can pass `format` instead.
 */
const FORMATS = {
  /** Grouped integer: 12,345. */
  int: (n: number) => groupedInt.format(n),
  /** Currency: $ prefix, digits scale with magnitude ($1,284 / $3.50 / $0.004). */
  usd: (n: number) => {
    const d = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 1 ? 2 : 3;
    return `$${n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
  },
  /** Compact: 1.2k / 3.4M. */
  compact: (n: number) => compactNum.format(n).replace("K", "k"),
  /** Percent of a 0–100 value: 42% / 99.9%. */
  percent: (n: number) => `${percentNum.format(n)}%`,
} as const;

export type CountUpFormat = keyof typeof FORMATS;

export type CountUpProps = {
  value: number;
  from?: number;
  /** Animation length in ms. */
  duration?: number;
  /** Built-in formatter name; ignored when `format` is given. */
  as?: CountUpFormat;
  /** Custom formatter — client-side callers only (functions cannot cross the RSC boundary). */
  format?: (n: number) => string;
  className?: string;
};

/**
 * Counts up once, the first time it scrolls into view. Width is reserved from
 * the final value up front so nothing reflows. Disabled under reduced motion.
 */
export function CountUp({
  value,
  from = 0,
  duration = 900,
  as = "int",
  format,
  className,
}: CountUpProps) {
  const fmt = format ?? FORMATS[as];
  const ref = React.useRef<HTMLSpanElement>(null);
  const seen = useInView(ref);
  const reduced = useReducedMotion();
  const [n, setN] = React.useState(value);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (!seen || reduced || started.current) return;
    started.current = true;
    setN(from);
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setN(from + (value - from) * eased);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduced, from, value, duration]);

  const final = fmt(value);

  return (
    <span
      ref={ref}
      className={`moco-countup${className ? ` ${className}` : ""}`}
      style={{ display: "inline-grid" }}
    >
      {/* Reserves the final width; invisible but laid out. */}
      <span aria-hidden="true" style={{ gridArea: "1/1", visibility: "hidden" }}>
        {final}
      </span>
      <span style={{ gridArea: "1/1" }}>{fmt(n)}</span>
    </span>
  );
}
