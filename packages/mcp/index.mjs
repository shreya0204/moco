#!/usr/bin/env node
// moco-mcp — stateless, read-only stdio MCP server over the bundled moco registry.
// No network, no writes, no shell. The registry JSON is built by
// `pnpm build:registry` and ships inside this package.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const PKG_DIR = dirname(fileURLToPath(import.meta.url));
const DIR = join(PKG_DIR, "registry");

let pkg, index, names;
try {
  pkg = JSON.parse(readFileSync(join(PKG_DIR, "package.json"), "utf8"));
  index = JSON.parse(readFileSync(join(DIR, "registry.json"), "utf8"));
  names = readdirSync(DIR).filter((f) => f !== "registry.json").map((f) => f.replace(/\.json$/, ""));
  if (!names.length) throw new Error("registry is empty");
} catch (err) {
  console.error(`moco-mcp: bundled registry is missing or corrupt (${err.message}). Reinstall the package.`);
  process.exit(1);
}

const item = (name) => JSON.parse(readFileSync(join(DIR, `${name}.json`), "utf8"));
const text = (t) => ({ content: [{ type: "text", text: typeof t === "string" ? t : JSON.stringify(t, null, 2) }] });
const summary = (i) => ({ name: i.name, title: i.title, description: i.description, tags: i.meta?.tags ?? [] });
const readOnly = { annotations: { readOnlyHint: true, openWorldHint: false } };

const server = new McpServer({ name: "moco", version: pkg.version });

server.registerTool(
  "list_components",
  {
    description: "List all moco components (editorial React components: scrollytelling, margin notes, sparklines, before/after compare, diagrams, code walkthroughs, …) with one-line descriptions and tags.",
    ...readOnly,
  },
  async () => text(index.items.map(summary)),
);

server.registerTool(
  "search_components",
  {
    description: "Search moco components by need, e.g. 'before/after image comparison', 'animated number', 'table of contents'. Matches name, title, description and tags.",
    inputSchema: { query: z.string().describe("What you're looking for") },
    ...readOnly,
  },
  async ({ query }) => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = index.items
      .map(summary)
      .map((s) => {
        const hay = [s.name, s.title, s.description, ...s.tags].join(" ").toLowerCase();
        return { s, score: terms.filter((t) => hay.includes(t)).length };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.s);
    return text(hits.length ? hits : `No match. Available: ${names.join(", ")}`);
  },
);

server.registerTool(
  "get_component",
  {
    description: "Get a moco component: full source files (tsx + css) to copy into the project, npm dependencies, other moco items it needs, and a usage example. Write each file to its `target` path (adjust the components/moco/ prefix to the project's conventions), install `dependencies` from npm, and fetch each entry of `registryDependencies` with this tool too (they are moco item names/urls — `tokens` is required once per project).",
    inputSchema: { name: z.enum(names) },
    ...readOnly,
  },
  async ({ name }) => {
    const i = item(name);
    return text({
      name: i.name, title: i.title, description: i.description,
      dependencies: i.dependencies,
      registryDependencies: (i.registryDependencies ?? []).map((u) => u.replace(/^.*\/r\/(.+)\.json$/, "$1")),
      files: i.files.map(({ path, target, content }) => ({ path, target, content })),
      usage: i.docs ?? null,
    });
  },
);

server.registerTool(
  "get_theme",
  {
    description: "Get moco's design token contract (tokens.css: light + dark themes) and how to retheme: override any --moco-* variable after the import. Required setup for every moco component.",
    ...readOnly,
  },
  async () => text({
    tokensCss: item("tokens").files[0].content,
    howTo: "Save as components/moco/tokens.css (or anywhere global) and import it once in the root layout / global stylesheet. Retheme by overriding --moco-* variables in your own :root after the import. Dark mode: automatic via prefers-color-scheme; force with data-theme=\"dark\" or \"light\" on <html>. Fonts: the defaults are system stacks — point --moco-serif/--moco-mono/--moco-sans/--moco-display at your loaded fonts for the full editorial look.",
  }),
);

server.registerTool(
  "get_setup",
  {
    description: "One-time moco project setup instructions: token import, fonts, framework notes, accessibility guarantees. Call this before installing the first component into a project.",
    ...readOnly,
  },
  async () => text(
    `# moco setup
1. Install the tokens once: call get_component("tokens"), write tokens.css into the project, import it in the root layout (Next: app/layout.tsx \`import "@/components/moco/tokens.css"\`; Vite: in main.tsx).
2. Components are copy-source: write each file from get_component at its \`target\` path. They import their own CSS relatively — keep .tsx and .css side by side.
3. Cross-component imports use the alias "@/components/moco/..." — ensure the project maps "@/*" to its source root (Next.js default). Otherwise rewrite those imports to relative paths.
4. Works in any React 18+/19 app. Items marked framework:"next" (code, view-transitions) need Next.js App Router; everything else is framework-agnostic client/server React.
5. npm deps: install anything listed in \`dependencies\` (e.g. shiki for the code item).
6. Accessibility ships in the components (ARIA roles, keyboard support, prefers-reduced-motion) — don't strip it when customizing.
7. Fonts (optional, recommended): serif for prose, mono for data/chrome — set --moco-serif and --moco-mono to your fonts.`,
  ),
);

await server.connect(new StdioServerTransport());
