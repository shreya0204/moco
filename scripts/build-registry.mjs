// Builds the shadcn-format registry from registry/*/meta.json:
//   apps/web/public/r/<name>.json  (full items, file contents embedded)
//   apps/web/public/r/registry.json (index)
//   packages/mcp/registry/          (same JSON, bundled into the npm package)
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_URL =
  process.env.REGISTRY_URL ?? process.env.NEXT_PUBLIC_REGISTRY_URL ?? "https://mocoui.site";
const SRC = join(ROOT, "registry");
const OUT_WEB = join(ROOT, "apps/web/public/r");
const OUT_MCP = join(ROOT, "packages/mcp/registry");

const fileType = (f) =>
  f.endsWith(".css") ? "registry:file"
  : /hooks\.tsx?$|\.ts$/.test(f) ? "registry:hook"
  : "registry:component";

// Pass 1: collect + validate every meta.json before emitting anything.
const metas = [];
for (const dir of readdirSync(SRC).sort()) {
  const metaPath = join(SRC, dir, "meta.json");
  if (!statSync(join(SRC, dir)).isDirectory() || !existsSync(metaPath)) continue;
  let meta;
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch (e) {
    fail(`${dir}/meta.json is not valid JSON: ${e.message}`);
  }
  for (const field of ["name", "title", "description", "files"]) {
    if (!meta[field] || (field === "files" && !meta.files.length)) fail(`${dir}/meta.json missing "${field}"`);
  }
  if (meta.name !== dir) fail(`${dir}/meta.json name "${meta.name}" doesn't match its directory`);
  for (const f of meta.files) {
    if (!existsSync(join(SRC, dir, f))) fail(`${dir}: listed file "${f}" does not exist`);
  }
  metas.push(meta);
}
const known = new Set(metas.map((m) => m.name));
for (const m of metas) {
  for (const d of m.registryDependencies ?? []) {
    if (!known.has(d)) fail(`${m.name}: registryDependency "${d}" is not a registry item`);
  }
}

function fail(msg) {
  console.error(`build-registry: ${msg}`);
  process.exit(1);
}

const items = [];
for (const meta of metas) {
  const dir = meta.name;
  const demoPath = join(SRC, dir, "demo.tsx");
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: meta.name,
    type: "registry:component",
    title: meta.title,
    description: meta.description,
    ...(meta.framework ? { framework: meta.framework } : {}),
    dependencies: meta.dependencies ?? [],
    registryDependencies: (meta.registryDependencies ?? []).map(
      (d) => `${REGISTRY_URL}/r/${d}.json`,
    ),
    files: meta.files.map((f) => ({
      path: `registry/${meta.name}/${f}`,
      type: fileType(f),
      target: `components/moco/${f}`,
      content: readFileSync(join(SRC, dir, f), "utf8"),
    })),
    ...(existsSync(demoPath) ? { docs: readFileSync(demoPath, "utf8") } : {}),
    meta: { tags: meta.tags ?? [] },
  };
  items.push(item);
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "moco",
  homepage: REGISTRY_URL,
  items: items.map(({ files, docs, ...rest }) => ({
    ...rest,
    files: files.map(({ content, ...f }) => f),
  })),
};

const llms = [
  "# moco — editorial components for React",
  "",
  "> Copy-source React components for technical essays and blogs: scrollytelling, margin notes, sparklines, before/after compares, animated numbers, block diagrams, code walkthroughs. shadcn-format registry; every component styles itself from --moco-* CSS tokens (light + dark). MCP server: `npx -y moco-mcp`.",
  "",
  `Setup: install the \`tokens\` item first (${REGISTRY_URL}/r/tokens.json) and import tokens.css once in the root layout. Install any item with \`npx shadcn@latest add ${REGISTRY_URL}/r/<name>.json\` or fetch the JSON directly — each item embeds full file contents and targets.`,
  "",
  "## Components",
  "",
  ...items.map((i) => `- [${i.title}](${REGISTRY_URL}/r/${i.name}.json): ${i.description}`),
].join("\n");

for (const out of [OUT_WEB, OUT_MCP]) {
  mkdirSync(out, { recursive: true });
  for (const item of items) writeFileSync(join(out, `${item.name}.json`), JSON.stringify(item, null, 2));
  writeFileSync(join(out, "registry.json"), JSON.stringify(index, null, 2));
}
writeFileSync(join(ROOT, "apps/web/public/llms.txt"), llms);
console.log(`registry: ${items.length} items → ${OUT_WEB} and ${OUT_MCP}`);
