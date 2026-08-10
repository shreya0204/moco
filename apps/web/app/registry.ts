import fs from "node:fs";
import path from "node:path";

export type RegistryFile = {
  path: string;
  type: string;
  target: string;
  content?: string;
};

export type RegistryItem = {
  name: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  meta?: { tags?: string[] };
  docs?: string;
  files: RegistryFile[];
};

const R_DIR = path.join(process.cwd(), "public/r");

export function listItems(): RegistryItem[] {
  const raw = fs.readFileSync(path.join(R_DIR, "registry.json"), "utf8");
  return JSON.parse(raw).items as RegistryItem[];
}

export function getItem(name: string): RegistryItem | null {
  // trust boundary: `name` comes from the URL
  if (!/^[a-z][a-z0-9-]*$/.test(name)) return null;
  try {
    return JSON.parse(
      fs.readFileSync(path.join(R_DIR, `${name}.json`), "utf8"),
    ) as RegistryItem;
  } catch {
    return null;
  }
}

/** Registry descriptions are data shared with the CLI; the site renders them
    without em dashes. "diagrams — rows" -> "diagrams: rows". */
export function displayDesc(s: string): string {
  return s.replace(/\s+—\s+/g, ": ").replace(/—/g, "-");
}

/** "https://moco.dev/r/hooks.json" -> "hooks" */
export function depName(url: string): string {
  return url.split("/").pop()!.replace(/\.json$/, "");
}
