import * as React from "react";
import "./figure.css";

export type FigurePlateProps = {
  children: React.ReactNode;
  /** Bold run-in phrase. Include its own full stop. */
  lead: string;
  caption: React.ReactNode;
  id?: string;
  /** Break out of a centred prose column to a wider measure. */
  wide?: boolean;
};

/**
 * A figure plate with a run-in caption. The caption sits outside the plate
 * and always opens with a bold run-in phrase — consistency is the point.
 */
export function FigurePlate({ children, lead, caption, id, wide = true }: FigurePlateProps) {
  return (
    <figure id={id} className={`moco-plate-wrap${wide ? " moco-breakout" : ""}`}>
      <div className="moco-plate">{children}</div>
      <figcaption className="moco-cap">
        <b className="moco-lead-in">{lead}</b> {caption}
      </figcaption>
    </figure>
  );
}

export type EdTableProps = {
  head: { label: string; numeric?: boolean }[];
  rows: React.ReactNode[][];
  /** Optional totals row, set off by a heavier rule. */
  summary?: React.ReactNode[];
  /** Bold run-in phrase for the caption. Include its own full stop. */
  lead: string;
  caption: React.ReactNode;
  /** Index of the row to emphasise. */
  bestIndex?: number;
};

/** Editorial table: caption below, small-caps heads, hairline rules, no zebra. */
export function EdTable({ head, rows, summary, lead, caption, bestIndex }: EdTableProps) {
  return (
    <table className="moco-ed">
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h.label} className={h.numeric ? "moco-n" : undefined} scope="col">
              {h.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} data-best={i === bestIndex ? "true" : undefined}>
            {r.map((c, j) => (
              <td key={j} className={head[j]?.numeric ? "moco-n" : undefined}>
                {c}
              </td>
            ))}
          </tr>
        ))}
        {summary ? (
          <tr className="moco-summary">
            {summary.map((c, j) => (
              <td key={j} className={head[j]?.numeric ? "moco-n" : undefined}>
                {c}
              </td>
            ))}
          </tr>
        ) : null}
      </tbody>
      <caption>
        <b className="moco-lead-in">{lead}</b> {caption}
      </caption>
    </table>
  );
}
