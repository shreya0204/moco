"use client";

import * as React from "react";
import { useInView, useReadProgress, useScrollspy, smoothScrollTo } from "./hooks";

const SECTIONS = ["one", "two", "three"];

export default function HooksDemo() {
  const active = useScrollspy(SECTIONS);
  const progress = useReadProgress("#demo-article");
  const ref = React.useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref);

  return (
    <div style={{ fontFamily: "var(--moco-serif)", color: "var(--moco-body)" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          gap: "1rem",
          alignItems: "baseline",
          padding: "0.6rem 0",
          background: "var(--moco-bg)",
          borderBottom: "1px solid var(--moco-line)",
          fontFamily: "var(--moco-mono)",
          fontSize: "0.85rem",
        }}
      >
        <span style={{ color: "var(--moco-muted)" }}>
          read: {Math.round(progress * 100)}%
        </span>
        {SECTIONS.map((id, i) => (
          <button
            key={id}
            onClick={() => smoothScrollTo(id)}
            style={{
              font: "inherit",
              border: 0,
              background: "none",
              padding: 0,
              cursor: "pointer",
              color: active === i ? "var(--moco-ink)" : "var(--moco-faint)",
              fontWeight: active === i ? 700 : 400,
            }}
          >
            {id}
          </button>
        ))}
      </div>
      <article id="demo-article">
        {SECTIONS.map((id) => (
          <section key={id} id={id} style={{ minHeight: "60vh", paddingTop: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--moco-display)", fontWeight: 400, color: "var(--moco-ink)" }}>{id}</h2>
            <p style={{ maxWidth: "38rem" }}>
              Scroll — the bar above tracks read progress through the article,
              and the section names bold as their heading crosses the viewport.
            </p>
          </section>
        ))}
        <p ref={ref} style={{ fontFamily: "var(--moco-mono)", fontSize: "0.85rem" }}>
          {seen ? "useInView: you scrolled me into view." : "Scroll down…"}
        </p>
      </article>
    </div>
  );
}
