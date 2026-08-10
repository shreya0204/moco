# moco

**Editorial components for React.** Copy-source components for technical essays and blogs — scrollytelling, Tufte margin notes, sparklines, before/after compares, animated numbers, block diagrams, code walkthroughs.

Not another UI kit. moco is for people who *write*: every component is built for longform technical prose, with real typography, `prefers-reduced-motion` support, and ARIA baked in.

## Three ways to install

**1. Ask Claude (MCP)** — add the moco MCP server and just describe what you need ("add a before/after slider to my post"):

```json
{ "mcpServers": { "moco": { "command": "npx", "args": ["-y", "moco-mcp"] } } }
```

**2. shadcn CLI** — moco is a standard shadcn-format registry:

```sh
npx shadcn@latest add https://mocoui.site/r/compare.json
```

Or register the namespace once in your `components.json` and install by name
(this also lets the official shadcn MCP browse moco):

```json
{ "registries": { "@moco": "https://mocoui.site/r/{name}.json" } }
```

```sh
npx shadcn@latest add @moco/compare
```

**3. Copy-paste** — every component is a `.tsx` + `.css` pair on the docs site. Take it, it's yours.

## Setup

Install the `tokens` item once and import `tokens.css` in your root layout. Every component styles itself exclusively from `--moco-*` variables — override any of them to retheme. Light and dark themes ship by default (`prefers-color-scheme`, forceable via `data-theme`).

## Repo layout

- `registry/` — component sources (one dir per item: `.tsx`, `.css`, `meta.json`, `demo.tsx`)
- `apps/web` — docs site; serves the registry at `/r/*.json`
- `packages/mcp` — `moco-mcp`, the MCP server (bundles the registry)
- `scripts/build-registry.mjs` — emits the shadcn-format registry

## Develop

```sh
pnpm install
pnpm build:registry
pnpm dev
```
