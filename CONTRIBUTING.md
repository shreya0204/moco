# Contributing to moco

## Setup

```sh
pnpm install
pnpm build:registry   # emits apps/web/public/r + packages/mcp/registry
pnpm dev              # docs site at localhost:3000
pnpm test             # registry validation + MCP stdio smoke test
```

## Anatomy of a registry item

Each component lives in `registry/<name>/`:

- `<name>.tsx` — the component. Imports its own CSS (`import "./<name>.css"`).
- `<name>.css` — all styling, every class prefixed `.moco-`.
- `meta.json` — name, title, description, tags, npm `dependencies`,
  `registryDependencies` (other moco items), `files`.
- `demo.tsx` — a self-contained usage example; rendered live on the docs site
  and shipped as the item's usage snippet.

## Rules

1. **Tokens only.** Components style themselves exclusively from `--moco-*`
   variables (see `registry/tokens/tokens.css`) and must work in light AND dark.
   No hardcoded colors except alpha-only masks.
2. **Accessibility is not optional.** Keep ARIA roles, keyboard support, focus
   management, and `prefers-reduced-motion` handling intact.
3. **No site coupling.** No imports outside the item other than
   `@/components/moco/hooks` (declared in `registryDependencies`). Framework-
   specific items must declare `"framework": "next"` in meta.json.
4. **Copy-source mindset.** The code you write lands in other people's repos.
   Keep it readable, typed (exported prop types), and dependency-light.

`pnpm build:registry` validates meta.json shape and dependency resolution;
CI runs the full build plus the MCP smoke test on every push.
