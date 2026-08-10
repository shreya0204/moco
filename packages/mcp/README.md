# moco-mcp

MCP server for **[moco](https://mocoui.site)** — editorial React components
for technical essays and blogs: scrollytelling, margin notes, sparklines,
before/after compares, block diagrams, code walkthroughs.

Connect it to Claude (or any MCP client) and install components by describing
what you need: *"add a before/after slider to my post."*

## Setup

```json
{
  "mcpServers": {
    "moco": { "command": "npx", "args": ["-y", "moco-mcp"] }
  }
}
```

Claude Code: `claude mcp add moco -- npx -y moco-mcp`

## Tools

All tools are **read-only** (annotated `readOnlyHint`); the server makes no
network requests and never writes to disk — it serves its own bundled registry.

| Tool | Purpose |
| --- | --- |
| `list_components` | All components with descriptions and tags |
| `search_components` | Find components by need ("animated number", "table of contents") |
| `get_component` | Full copy-source files (tsx + css), deps, usage example |
| `get_theme` | The `--moco-*` design-token contract (light + dark) and theming guide |
| `get_setup` | One-time project setup instructions |

## How installs work

moco is a copy-source, [shadcn-format registry](https://mocoui.site/r/registry.json).
The MCP client writes each returned file at its `target` path; the code is yours
to keep and modify. Equivalent CLI: `npx shadcn@latest add https://mocoui.site/r/<name>.json`.

Docs, live demos, and theming guide: **https://mocoui.site**

MIT © Shreya Agarwal
