/* The docs shell's "Getting started" group, in reading order. Component pages
   continue the chain alphabetically after the last entry. */
export type PageRef = { href: string; label: string };

export const GETTING_STARTED: PageRef[] = [
  { href: "/docs", label: "Introduction" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/mcp", label: "MCP server" },
];
