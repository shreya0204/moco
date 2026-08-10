import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4, Geist_Mono, Instrument_Serif } from "next/font/google";
import "@moco/registry/tokens/tokens.css";
import "./globals.css";
import type { IndexEntry } from "@moco/registry/palette/palette";
import { GitHubIcon, NpmIcon } from "./icons";
import { listItems } from "./registry";
import { GITHUB_URL, NPM_URL, REGISTRY_URL } from "./site";
import { SiteHeader } from "./site-header";

/* ⌘K search index: docs pages + every registry component. Built on the
   server (node:fs) and passed to the client header. */
const SEARCH_INDEX: IndexEntry[] = [
  { kind: "page", label: "Introduction", href: "/docs" },
  { kind: "page", label: "Installation", href: "/docs/installation" },
  { kind: "page", label: "Theming", href: "/docs/theming" },
  { kind: "page", label: "MCP server", href: "/docs/mcp" },
  ...listItems().map((item) => ({
    kind: "page" as const,
    label: item.title,
    href: `/components/${item.name}`,
  })),
];

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(REGISTRY_URL),
  title: "moco · components for people who write",
  description:
    "An open-source library of editorial React components. Scrollytelling, margin notes, sparklines, diagrams, and more. Copy the source, use the shadcn CLI, or ask Claude to install it over MCP.",
  openGraph: {
    title: "moco · components for people who write",
    description:
      "Open-source editorial React components. Copy the source, use the shadcn CLI, or ask Claude to install it over MCP.",
    siteName: "moco",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${serif.variable} ${mono.variable} ${display.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader
          githubUrl={GITHUB_URL}
          npmUrl={NPM_URL}
          searchIndex={SEARCH_INDEX}
        />
        {children}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <span className="wordmark">moco</span>
              <p className="tagline">
                Editorial components for React. Copy the source. The code is
                yours.
              </p>
            </div>
            <nav aria-label="Product">
              <h2>Product</h2>
              <ul>
                <li>
                  <Link href="/components">Components</Link>
                </li>
                <li>
                  <Link href="/docs">Docs</Link>
                </li>
                <li>
                  <a href={`${REGISTRY_URL}/llms.txt`}>llms.txt</a>
                </li>
              </ul>
            </nav>
            <nav aria-label="Install">
              <h2>Install</h2>
              <ul>
                <li>
                  <Link href="/docs/mcp">MCP server</Link>
                </li>
                <li>
                  <Link href="/docs/installation">shadcn CLI</Link>
                </li>
                <li>
                  <a href={`${REGISTRY_URL}/r/registry.json`}>registry.json</a>
                </li>
              </ul>
            </nav>
            <nav aria-label="Project">
              <h2>Project</h2>
              <ul>
                <li>
                  <a href={GITHUB_URL} rel="noreferrer" className="icon-text">
                    <GitHubIcon size={16} />
                    GitHub
                  </a>
                </li>
                <li>
                  <a href={NPM_URL} rel="noreferrer" className="icon-text">
                    <NpmIcon size={16} />
                    npm
                  </a>
                </li>
                <li>
                  <a href={`${GITHUB_URL}/blob/main/LICENSE`} rel="noreferrer">
                    MIT license
                  </a>
                </li>
                <li>
                  <a href={`${GITHUB_URL}/issues`} rel="noreferrer">
                    Issues
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
