import type { Metadata } from "next";
import Link from "next/link";

import { CopyButton } from "../../copy-button";
import { GETTING_STARTED } from "../../docs-nav";
import { Pager } from "../../pager";

export const metadata: Metadata = {
  title: "Theming · moco",
  description:
    "The --moco-* token contract: colors, fonts, and easing. Override any variable to retheme the whole library, or force light or dark with data-theme.",
};

const OVERRIDE_SNIPPET = `/* your globals.css, after tokens.css */
:root {
  --moco-accent: #ffd166;      /* lime → amber */
  --moco-accent-dk: #8a6a00;   /* keep ~4.5:1 on --moco-bg for text duty */
}`;

/* Light-theme values, shown as swatches. The site itself is pinned light, so
   var() renders the same values — hex kept literal for the code column. */
const COLOR_TOKENS: [string, string, string][] = [
  ["--moco-bg", "#fcfbf9", "Page ground, warm paper"],
  ["--moco-panel", "#f4f2ee", "Raised panels and code blocks"],
  ["--moco-ink", "rgba(0,0,0,0.88)", "Headings, strongest text"],
  ["--moco-body", "rgba(0,0,0,0.76)", "Body text"],
  ["--moco-muted", "rgba(0,0,0,0.6)", "Secondary text"],
  ["--moco-faint", "rgba(0,0,0,0.48)", "Captions, tertiary text"],
  ["--moco-line", "rgba(0,0,0,0.12)", "Hairline borders"],
  ["--moco-accent", "#c6f24e", "Lime accent, fills only on paper"],
  ["--moco-accent-dk", "#5b770c", "Accent for text and strokes (4.9:1)"],
  ["--moco-on-accent", "#14180a", "Text on top of accent fills"],
  ["--moco-warn", "#b8437a", "Warning / highlight color"],
  ["--moco-accent-wash", "rgba(198,242,78,0.34)", "Translucent accent wash"],
  ["--moco-warn-wash", "rgba(184,67,122,0.1)", "Translucent warn wash"],
  ["--moco-hover-wash", "rgba(0,0,0,0.04)", "Hover backgrounds"],
];

const FONT_TOKENS: [string, string][] = [
  ["--moco-serif", "Long-form prose"],
  ["--moco-mono", "Code, numbers, technical labels"],
  ["--moco-sans", "UI text"],
  ["--moco-display", "Display headings and the wordmark"],
];

export default function ThemingPage() {
  return (
    <article className="doc">
      <header className="doc-header">
        <h1>Theming</h1>
        <p className="lede">
          Components never hardcode colors, fonts, or easing, only{" "}
          <code>var(--moco-*)</code>. Override any token to retheme the whole
          library.
        </p>
      </header>

      <h2>Color tokens</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Light value</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {COLOR_TOKENS.map(([token, value, role]) => (
              <tr key={token}>
                <td>
                  <span className="swatch" style={{ background: `var(${token})` }} aria-hidden />
                  <code>{token}</code>
                </td>
                <td>
                  <code>{value}</code>
                </td>
                <td>{role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Fonts and motion</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {FONT_TOKENS.map(([token, role]) => (
              <tr key={token}>
                <td>
                  <code>{token}</code>
                </td>
                <td>{role}</td>
              </tr>
            ))}
            <tr>
              <td>
                <code>--moco-ease</code>
              </td>
              <td>The single easing curve used for all motion</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The font slots default to system stacks. Point them at your loaded
        webfonts (this site wires <code>next/font</code> variables into them in
        one CSS rule).
      </p>

      <h2>Dark mode</h2>
      <p>
        The library ships a full dark palette that activates via{" "}
        <code>prefers-color-scheme: dark</code>. To force a theme regardless of
        system preference, set <code>data-theme</code> on <code>&lt;html&gt;</code>:
      </p>
      <ul>
        <li>
          <code>&lt;html data-theme=&quot;dark&quot;&gt;</code> is always dark
        </li>
        <li>
          <code>&lt;html data-theme=&quot;light&quot;&gt;</code> is always light
          (the dark media query is guarded with{" "}
          <code>:root:not([data-theme=&quot;light&quot;])</code>, so this wins)
        </li>
      </ul>
      <p>This docs site pins itself light exactly this way.</p>

      <h2>Overriding tokens</h2>
      <p>
        Declare your overrides after <code>tokens.css</code>. For example,
        swapping the accent:
      </p>
      <div className="codeblock">
        <div className="codeblock-head">
          <span>globals.css</span>
          <CopyButton text={OVERRIDE_SNIPPET} />
        </div>
        <pre>
          <code>{OVERRIDE_SNIPPET}</code>
        </pre>
      </div>
      <p>
        The one rule worth keeping: on light backgrounds the bright accent is a{" "}
        <em>fill</em> color. Text and strokes use <code>--moco-accent-dk</code>,
        which should hold roughly 4.5:1 contrast against{" "}
        <code>--moco-bg</code>. See the{" "}
        <Link href="/components/tokens">tokens</Link> item for the full source.
      </p>

      <Pager prev={GETTING_STARTED[1]} next={GETTING_STARTED[3]} />
    </article>
  );
}
