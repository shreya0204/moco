"use client";

import { Palette, type IndexEntry } from "./palette";

const INDEX: IndexEntry[] = [
  { kind: "post", label: "Prompt caching by the numbers", href: "#" },
  { kind: "post", label: "The island pattern", href: "#" },
  { kind: "page", label: "About", href: "#" },
];

export default function PaletteDemo() {
  return (
    <div className="prose" style={{ maxWidth: "42rem", margin: "0 auto", padding: "2rem 1rem" }}>
      <p>
        Press <kbd>⌘K</kbd> (or <kbd>Ctrl-K</kbd>) and type a few letters — matching is by
        subsequence, so “pcn” finds “Prompt caching by the numbers”.
      </p>
      <h2 id="demo-section-one">A section on this page</h2>
      <p>Sections with ids are scraped into the index each time the palette opens.</p>
      <h2 id="demo-section-two">Another section</h2>
      <p>Selecting a section scrolls to it; selecting a post or page navigates.</p>
      <Palette index={INDEX} onNavigate={(href) => console.log("navigate:", href)} />
    </div>
  );
}
