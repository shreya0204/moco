"use client";

import { Rail, type Heading } from "./rail";

const HEADINGS: Heading[] = [
  { id: "one", text: "First section" },
  { id: "two", text: "Second section" },
  { id: "three", text: "Third section" },
];

export default function RailDemo() {
  return (
    <div>
      <Rail headings={HEADINGS} />
      <main style={{ maxWidth: "42rem", margin: "0 auto", padding: "4rem 1rem" }}>
        {HEADINGS.map((h) => (
          <section key={h.id}>
            <h2 id={h.id}>{h.text}</h2>
            {Array.from({ length: 12 }, (_, i) => (
              <p key={i}>
                Widen the window past 1280px and scroll — the tick on the left edge follows the
                section you are reading, and hovering the rail reveals the labels.
              </p>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
