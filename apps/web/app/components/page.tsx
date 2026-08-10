import type { Metadata } from "next";
import Link from "next/link";

import { displayDesc, listItems } from "../registry";

export const metadata: Metadata = {
  title: "Components · moco",
  description:
    "Every moco component: live demos, install paths, and full source for each item in the registry.",
};

export default function ComponentsIndexPage() {
  const items = [...listItems()].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="doc" style={{ maxWidth: "none" }}>
      <header className="doc-header">
        <h1>Components</h1>
        <p className="lede">
          {items.length} items. Every one ships a live demo, three install
          paths, and its full source.
        </p>
      </header>
      <div className="cards">
        {items.map((item) => (
          <Link key={item.name} href={`/components/${item.name}`} className="card">
            <h3>{item.name}</h3>
            <p>{displayDesc(item.description)}</p>
            <span className="chips">
              {(item.meta?.tags ?? []).slice(0, 3).map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
