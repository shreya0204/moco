import Link from "next/link";

import { ClaudeDemo } from "./claude-demo";
import { CopyButton } from "./copy-button";
import { demos } from "./demos";
import { InstallTabs } from "./install-tabs";
import { displayDesc, listItems } from "./registry";
import { REGISTRY_URL } from "./site";

const MCP_SNIPPET = `{
  "mcpServers": {
    "moco": { "command": "npx", "args": ["-y", "moco-mcp"] }
  }
}`;

/* Gallery layout, in display order. Items that pin to the viewport
   (position: fixed) can't live inside a grid cell, so they link out. */
const GALLERY: {
  name: string;
  wide?: boolean;
  tall?: boolean;
  linkOut?: string;
}[] = [
  { name: "compare" },
  { name: "spark" },
  { name: "scrub", wide: true },
  { name: "code", wide: true },
  { name: "stepper" },
  { name: "math" },
  { name: "diagram", wide: true },
  { name: "notes", wide: true },
  { name: "figure", tall: true },
  { name: "cover", tall: true },
];

const FEATURES = [
  {
    title: "You own the code",
    body: "No package to install. Components land as .tsx and .css files in your repo. Edit them like anything else you wrote.",
  },
  {
    title: "Claude installs it",
    body: "moco ships an MCP server. Describe what you need and the component shows up in your repo, imports wired.",
  },
  {
    title: "Works with shadcn",
    body: "A standard shadcn-format registry. npx shadcn add works with every item, no custom tooling.",
  },
  {
    title: "Accessible by default",
    body: "ARIA roles, keyboard support, and prefers-reduced-motion are handled inside every component.",
  },
];

export default function Home() {
  const items = listItems();
  const byName = new Map(items.map((i) => [i.name, i]));
  const oneLiner = `npx shadcn@latest add ${REGISTRY_URL}/r/compare.json`;

  const tabs = [
    {
      label: "Ask Claude (MCP)",
      note: "Add the server to your MCP config, then ask for what you need. Claude writes the files into your repo.",
      file: ".mcp.json",
      code: MCP_SNIPPET,
    },
    {
      label: "shadcn CLI",
      note: "moco is a standard shadcn-format registry. Add any item by URL.",
      file: "Terminal",
      code: oneLiner,
    },
    {
      label: "Copy-paste",
      note: "Every component is a .tsx and .css pair with full source on its page. Take the files. They're yours.",
      file: "components/moco/",
      code: "components/moco/compare.tsx\ncomponents/moco/compare.css",
    },
  ];

  return (
    <main id="main" className="wrap landing">
      <section className="hero" aria-labelledby="hero-h">
        <p className="hero-badge">
          {items.length} open-source components · MIT · MCP server included
        </p>
        <h1 id="hero-h">
          Components for people who <mark>write</mark>.
        </h1>
        <p className="sub">
          moco is an open-source library of editorial React components.
          Scrollytelling, margin notes, sparklines, and {items.length - 3}{" "}
          more. Copy the source, or let Claude install it for you.
        </p>
        <div className="hero-ctas">
          <Link href="/docs/installation" className="btn btn-primary">
            Get started
          </Link>
          <Link href="/components" className="btn btn-ghost">
            Browse components
          </Link>
        </div>
        <p className="hero-install">
          <code>{oneLiner}</code>
          <CopyButton text={oneLiner} />
        </p>
      </section>

      <section aria-label="Watch Claude install a component">
        <ClaudeDemo />
      </section>

      <section aria-labelledby="gallery-h">
        <div className="section-head">
          <h2 id="gallery-h">Every component, live on this page</h2>
          <p>Drag, scroll, and press things. Each caption links to install paths and full source.</p>
        </div>
        <div className="showcase">
          {GALLERY.map(({ name, wide, tall, linkOut }) => {
            const item = byName.get(name);
            const Demo = demos[name];
            if (!item) return null;
            return (
              <figure
                key={name}
                className={`showcase-panel${wide ? " wide" : ""}${tall ? " tall" : ""}`}
              >
                {linkOut || !Demo ? (
                  <div className="demo-stage demo-linkout">
                    <p>{linkOut}</p>
                    <Link href={`/components/${name}`} className="btn btn-ghost">
                      Open full demo
                    </Link>
                  </div>
                ) : (
                  <div className="demo-stage">
                    <Demo />
                  </div>
                )}
                <figcaption>
                  <Link href={`/components/${name}`}>{name}</Link>
                  <span>{displayDesc(item.description)}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
        <div className="gallery-more">
          <Link href="/components" className="btn btn-ghost">
            View all components
          </Link>
        </div>
      </section>

      <section aria-labelledby="install-h">
        <div className="section-head" style={{ marginInline: "auto", textAlign: "center" }}>
          <h2 id="install-h">Install it your way</h2>
          <p>Three paths to the same files. Pick one.</p>
        </div>
        <InstallTabs tabs={tabs} />
      </section>

      <section aria-labelledby="features-h">
        <div className="section-head">
          <h2 id="features-h">The boring parts, done</h2>
          <p>Small, sharp components. Plain React, plain CSS, nothing to eject from.</p>
        </div>
        <div className="features">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature">
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
