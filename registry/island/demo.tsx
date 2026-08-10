"use client";

import { Island, type Heading } from "./island";

const HEADINGS: Heading[] = [
  { id: "why", text: "Why islands" },
  { id: "how", text: "How it morphs" },
  { id: "end", text: "Winding down" },
];

export default function IslandDemo() {
  return (
    <div>
      <Island
        title="A demo essay about islands"
        headings={HEADINGS}
        readingTime={4}
        brand={{ label: "Home", href: "#" }}
        links={[{ label: "All writing", href: "#" }]}
        next={{ label: "The follow-up essay", href: "#" }}
        articleSelector="#article-root"
      />
      <article id="article-root" style={{ maxWidth: "42rem", margin: "0 auto", padding: "6rem 1rem" }}>
        {HEADINGS.map((h) => (
          <section key={h.id}>
            <h2 id={h.id}>{h.text}</h2>
            {Array.from({ length: 14 }, (_, i) => (
              <p key={i}>
                Scroll to watch the island expand, track this section, and finally morph into a
                Read-next link. This paragraph only exists to give it something to measure.
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
