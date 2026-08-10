import * as React from "react";
import "./diagram.css";

/**
 * HTML/CSS block diagrams. Real DOM, not SVG and not images: every label is
 * selectable text, reachable by a screen reader, and reflows on mobile.
 */

export interface DgmProps {
  children: React.ReactNode;
  minWidth?: number;
  live?: boolean;
}

export function Dgm({ children, minWidth, live }: DgmProps) {
  return (
    <div
      className="moco-dgm"
      style={minWidth ? { minWidth } : undefined}
      role="group"
      aria-live={live ? "polite" : undefined}
    >
      {children}
    </div>
  );
}

export interface DgmRowProps {
  label?: string;
  children: React.ReactNode;
  note?: React.ReactNode;
}

export function DgmRow({ label, children, note }: DgmRowProps) {
  return (
    <>
      <div className="moco-dgm-row">
        <div className="moco-dgm-row-label">{label}</div>
        <div className="moco-dgm-track">{children}</div>
      </div>
      {note ? (
        <div className="moco-dgm-row" style={{ marginTop: "-0.7rem" }}>
          <div />
          <div className="moco-dgm-note">{note}</div>
        </div>
      ) : null}
    </>
  );
}

export type BlockVariant = "default" | "active" | "dashed" | "warn" | "ghost";

export interface DgmBlockProps {
  label: React.ReactNode;
  sub?: React.ReactNode;
  variant?: BlockVariant;
  tip?: string;
  grow?: number;
  id?: string;
}

export function DgmBlock({
  label,
  sub,
  variant = "default",
  tip,
  grow = 1,
  id,
}: DgmBlockProps) {
  return (
    <div
      id={id}
      className="moco-dgm-block"
      data-variant={variant}
      style={{ flexGrow: grow }}
      tabIndex={tip ? 0 : undefined}
      title={tip}
    >
      <span className="moco-b-label">{label}</span>
      {sub ? <span className="moco-b-sub">{sub}</span> : null}
      {tip ? <span className="moco-dgm-tip">{tip}</span> : null}
    </div>
  );
}

export function DgmDiamond({ label }: { label?: string }) {
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", flex: "none" }}
      aria-label={label ? `marker: ${label}` : "marker"}
    >
      <span className="moco-dgm-diamond" />
      {label ? (
        <span style={{ fontSize: 11.5, color: "var(--moco-faint)" }}>{label}</span>
      ) : null}
    </span>
  );
}

export interface DgmBracketProps {
  children: React.ReactNode;
  /** How many block-widths the bracket covers. */
  span?: number;
  /** How many block-widths to skip before it starts. */
  offset?: number;
  /** Total block-widths in the row above. */
  total?: number;
}

export function DgmBracket({ children, span = 1, offset = 0, total = 1 }: DgmBracketProps) {
  return (
    <div className="moco-dgm-row">
      <div />
      <div style={{ display: "flex" }}>
        {offset > 0 ? <div style={{ flex: offset }} /> : null}
        <div style={{ flex: span }}>
          <div className="moco-dgm-bracket" />
          <div className="moco-dgm-bracket-cap">{children}</div>
        </div>
        {total - span - offset > 0 ? <div style={{ flex: total - span - offset }} /> : null}
      </div>
    </div>
  );
}

export function DgmNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="moco-dgm-row">
      <div />
      <div className="moco-dgm-note">{children}</div>
    </div>
  );
}

export interface DgmLegendProps {
  items: { color: "accent" | "warn" | "faint" | "ink" | "line"; label: string }[];
}

export function DgmLegend({ items }: DgmLegendProps) {
  return (
    <div className="moco-dgm-legend">
      {items.map((it) => (
        <span
          key={it.label}
          style={{
            color: it.color === "accent" ? "var(--moco-accent-dk)" : `var(--moco-${it.color})`,
          }}
        >
          {/* The lime chip matches the filled block it stands for, but takes a
              dark border — on paper the lime alone has no edge. */}
          <span
            className="moco-sw"
            style={{
              background: it.color === "accent" ? "var(--moco-accent)" : "transparent",
              borderColor: it.color === "accent" ? "var(--moco-accent-dk)" : undefined,
            }}
          />
          <span style={{ color: "var(--moco-faint)" }}>{it.label}</span>
        </span>
      ))}
    </div>
  );
}
