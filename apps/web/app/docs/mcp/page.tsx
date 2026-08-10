import type { Metadata } from "next";
import Link from "next/link";

import { CopyButton } from "../../copy-button";
import { GETTING_STARTED } from "../../docs-nav";
import { Pager } from "../../pager";

export const metadata: Metadata = {
  title: "MCP server · moco",
  description:
    "moco-mcp bundles the whole registry into an MCP server so Claude can browse and install components for you. Setup for Claude Code and Claude Desktop, the five tools, and the security posture.",
};

const MCP_JSON = `{
  "mcpServers": {
    "moco": { "command": "npx", "args": ["-y", "moco-mcp"] }
  }
}`;

const CLAUDE_CODE_CMD = `claude mcp add moco -- npx -y moco-mcp`;

const TOOLS: [string, string][] = [
  ["list_components", "Every item with title, description, and tags"],
  ["search_components", "Query by name, tag, or description"],
  ["get_component", "Full source files, dependencies, and usage example for one item"],
  ["get_theme", "The token contract, for retheming"],
  ["get_setup", "One-time install instructions"],
];

export default function McpPage() {
  return (
    <article className="doc">
      <header className="doc-header">
        <h1>MCP server</h1>
        <p className="lede">
          <code>moco-mcp</code> bundles the whole registry into an MCP server,
          so Claude can browse, search, and install components for you.
        </p>
      </header>

      <h2>Setup</h2>

      <h3>Claude Code</h3>
      <p>One command:</p>
      <div className="codeblock">
        <div className="codeblock-head">
          <span>Terminal</span>
          <CopyButton text={CLAUDE_CODE_CMD} />
        </div>
        <pre>
          <code>{CLAUDE_CODE_CMD}</code>
        </pre>
      </div>
      <p>
        Or add it to your project&rsquo;s <code>.mcp.json</code> so the whole
        team gets it:
      </p>
      <div className="codeblock">
        <div className="codeblock-head">
          <span>.mcp.json</span>
          <CopyButton text={MCP_JSON} />
        </div>
        <pre>
          <code>{MCP_JSON}</code>
        </pre>
      </div>

      <h3>Claude Desktop</h3>
      <p>
        Add the same server block to{" "}
        <code>claude_desktop_config.json</code> (Settings → Developer → Edit
        Config):
      </p>
      <div className="codeblock">
        <div className="codeblock-head">
          <span>claude_desktop_config.json</span>
          <CopyButton text={MCP_JSON} />
        </div>
        <pre>
          <code>{MCP_JSON}</code>
        </pre>
      </div>

      <h2>The five tools</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>What it returns</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS.map(([name, desc]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>A typical conversation</h2>
      <ol>
        <li>
          You: <em>&ldquo;add a before/after slider to my post&rdquo;</em>
        </li>
        <li>
          Claude calls <code>search_components</code> and finds{" "}
          <Link href="/components/compare">compare</Link>
        </li>
        <li>
          Claude calls <code>get_component</code> and <code>get_setup</code>
        </li>
        <li>
          Claude writes <code>compare.tsx</code> + <code>compare.css</code> into{" "}
          <code>components/moco/</code> and wires the import
        </li>
      </ol>
      <p>No CLI, no copy-paste, no tab-switching.</p>

      <h2>Security posture</h2>
      <ul>
        <li>
          <strong>Read-only.</strong> All five tools are annotated read-only.
          The server never writes to your filesystem. Claude writes the files,
          under your normal permission flow.
        </li>
        <li>
          <strong>No network.</strong> The registry is bundled into the package
          at build time; the server makes no network calls at runtime.
        </li>
        <li>
          <strong>Nothing to configure.</strong> No tokens, no env vars, no
          state.
        </li>
      </ul>

      <Pager prev={GETTING_STARTED[2]} next={{ href: "/components/code", label: "code" }} />
    </article>
  );
}
