"use client";

import * as React from "react";
import { useInView, useReadProgress, useScrollspy, smoothScrollTo } from "./hooks";

export default function HooksDemo() {
  const sections = ["one", "two", "three"];
  const active = useScrollspy(sections);
  const progress = useReadProgress("#demo-article");
  const ref = React.useRef<HTMLParagraphElement>(null);
  const seen = useInView(ref);

  return (
    <div>
      <div style={{ position: "sticky", top: 0, display: "flex", gap: "1rem" }}>
        <span>read: {Math.round(progress * 100)}%</span>
        {sections.map((id, i) => (
          <button key={id} onClick={() => smoothScrollTo(id)} style={{ fontWeight: active === i ? 700 : 400 }}>
            {id}
          </button>
        ))}
      </div>
      <article id="demo-article">
        {sections.map((id) => (
          <section key={id} id={id} style={{ minHeight: "80vh" }}>
            <h2>{id}</h2>
          </section>
        ))}
        <p ref={ref}>{seen ? "You scrolled me into view." : "Scroll down…"}</p>
      </article>
    </div>
  );
}
