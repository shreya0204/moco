import type { Metadata } from "next";
import Link from "next/link";

import { CopyButton } from "../../copy-button";
import { GETTING_STARTED } from "../../docs-nav";
import { Pager } from "../../pager";
import { REGISTRY_URL } from "../../site";

export const metadata: Metadata = {
  title: "Installation · moco",
  description:
    "Set up the moco token contract, then install components via MCP, the shadcn CLI, or copy-paste.",
};

const MCP_SNIPPET = `{
  "mcpServers": {
    "moco": { "command": "npx", "args": ["-y", "moco-mcp"] }
  }
}`;

function Snippet({ file, code }: { file: string; code: string }) {
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span>{file}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function InstallationPage() {
  const tokensCmd = `npx shadcn@latest add ${REGISTRY_URL}/r/tokens.json`;

  return (
    <article className="doc">
      <header className="doc-header">
        <h1>Installation</h1>
        <p className="lede">
          One-time token setup, then install components by conversation, CLI,
          or copy-paste.
        </p>
      </header>

      <h2>1. Install the tokens</h2>
      <p>
        Every moco component styles itself exclusively from the{" "}
        <code>--moco-*</code> CSS variables defined by the{" "}
        <Link href="/components/tokens">tokens</Link> item. Install it once:
      </p>
      <Snippet file="Terminal" code={tokensCmd} />
      <p>Then import it in your root layout (or global stylesheet):</p>
      <Snippet file="app/layout.tsx" code={`import "@/components/moco/tokens.css";`} />

      <h2>2. Install components</h2>

      <h3>Ask Claude (MCP)</h3>
      <p>
        Add the <Link href="/docs/mcp">MCP server</Link> to your config, then
        describe what you need. Claude finds the component, writes the files,
        and wires the imports:
      </p>
      <Snippet file=".mcp.json" code={MCP_SNIPPET} />

      <h3>shadcn CLI</h3>
      <p>
        moco is a standard shadcn-format registry, so any item installs by URL:
      </p>
      <Snippet file="Terminal" code={`npx shadcn@latest add ${REGISTRY_URL}/r/compare.json`} />

      <h3>Copy-paste</h3>
      <p>
        Every component page shows the full source of each file with a copy
        button and its target path. Copy the <code>.tsx</code> +{" "}
        <code>.css</code> pair into <code>components/moco/</code> and you are
        done.
      </p>

      <h2>Import paths</h2>
      <p>
        Components install to <code>components/moco/*</code>, so imports look
        like:
      </p>
      <Snippet
        file="your-post.tsx"
        code={`import { Compare } from "@/components/moco/compare";`}
      />
      <p>
        The <code>@/</code> alias is the standard shadcn / Next.js convention.
        If your project maps it differently, adjust the import. The files have
        no other expectations.
      </p>

      <h2>Framework notes</h2>
      <ul>
        <li>
          <strong>Next.js App Router</strong>: everything works out of the box.
          Interactive components are already marked <code>&quot;use client&quot;</code>.
        </li>
        <li>
          <strong>Vite / Remix / anything React 18+</strong>: all components
          are plain React;{" "}
          <Link href="/components/view-transitions">view-transitions</Link> is
          the one item that assumes Next.js.
        </li>
      </ul>

      <h2>Peer dependencies</h2>
      <p>Rare, and listed per item on its page:</p>
      <ul>
        <li>
          <Link href="/components/code">code</Link> needs <code>shiki</code> for
          syntax highlighting
        </li>
        <li>
          <Link href="/components/math">math</Link> optionally pairs with{" "}
          <code>katex</code>
        </li>
      </ul>
      <p>Everything else is dependency-free React.</p>

      <Pager prev={GETTING_STARTED[0]} next={GETTING_STARTED[2]} />
    </article>
  );
}
