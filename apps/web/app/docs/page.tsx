import type { Metadata } from "next";
import Link from "next/link";

import { GETTING_STARTED } from "../docs-nav";
import { Pager } from "../pager";
import { listItems } from "../registry";

export const metadata: Metadata = {
  title: "Introduction · moco",
  description:
    "What moco is: copy-source editorial React components for technical essays and blogs, with a shadcn-compatible registry and an MCP server.",
};

export default function IntroductionPage() {
  const count = listItems().length;

  return (
    <article className="doc">
      <header className="doc-header">
        <h1>Introduction</h1>
        <p className="lede">
          moco is a copy-source library of editorial React components. Built
          for technical essays and blogs, not dashboards.
        </p>
      </header>

      <p>
        Most component libraries are built for products: forms, tables, modals.
        moco is built for <em>writing</em>: scrollytelling stages, margin
        notes, inline sparklines, before/after compares, block diagrams, code
        walkthroughs. Things that make a long technical read feel considered.
      </p>

      <h2>Philosophy</h2>
      <ul>
        <li>
          <strong>You own the code.</strong> There is no npm package to depend
          on. Every component is a <code>.tsx</code> + <code>.css</code> pair
          that lands in your repo. Edit it, fork it, delete half of it. It is
          your code from the moment it arrives.
        </li>
        <li>
          <strong>Editorial typography first.</strong> Components are designed
          to sit inside prose: sparklines align to the text baseline, notes live
          in the margin, numbers count up without shifting layout.
        </li>
        <li>
          <strong>The boring parts are done.</strong> ARIA roles, keyboard
          support, focus management, and <code>prefers-reduced-motion</code> are
          handled inside every component.
        </li>
        <li>
          <strong>Nothing to eject from.</strong> Plain React and plain CSS
          variables. No styling framework, no runtime dependency, no lock-in.
        </li>
      </ul>

      <h2>What&rsquo;s in the box</h2>
      <p>
        {count} registry items: interactive figures (
        <Link href="/components/compare">compare</Link>,{" "}
        <Link href="/components/scrolly">scrolly</Link>,{" "}
        <Link href="/components/stepper">stepper</Link>,{" "}
        <Link href="/components/zoom">zoom</Link>), inline elements (
        <Link href="/components/countup">countup</Link>,{" "}
        <Link href="/components/scrub">scrub</Link>,{" "}
        <Link href="/components/spark">spark</Link>,{" "}
        <Link href="/components/notes">notes</Link>), structure and navigation (
        <Link href="/components/island">island</Link>,{" "}
        <Link href="/components/rail">rail</Link>,{" "}
        <Link href="/components/palette">palette</Link>), visual pieces (
        <Link href="/components/diagram">diagram</Link>,{" "}
        <Link href="/components/cover">cover</Link>,{" "}
        <Link href="/components/dotgrid">dotgrid</Link>,{" "}
        <Link href="/components/figure">figure</Link>,{" "}
        <Link href="/components/math">math</Link>,{" "}
        <Link href="/components/code">code</Link>), plus utilities (
        <Link href="/components/hooks">hooks</Link>,{" "}
        <Link href="/components/view-transitions">view-transitions</Link>) and
        the <Link href="/components/tokens">tokens</Link> theme contract that
        styles them all.
      </p>

      <h2>Three ways in</h2>
      <ul>
        <li>
          <strong>Ask Claude.</strong> moco ships an{" "}
          <Link href="/docs/mcp">MCP server</Link>. Describe what you need and
          the component is installed for you.
        </li>
        <li>
          <strong>shadcn CLI.</strong> The registry is standard shadcn format, so{" "}
          <code>npx shadcn add</code> works with every item. See{" "}
          <Link href="/docs/installation">Installation</Link>.
        </li>
        <li>
          <strong>Copy-paste.</strong> Full source with copy buttons on every
          component page.
        </li>
      </ul>

      <Pager next={GETTING_STARTED[1]} />
    </article>
  );
}
