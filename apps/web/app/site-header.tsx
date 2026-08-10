"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Palette, type IndexEntry } from "@moco/registry/palette/palette";

import { GitHubIcon, NpmIcon } from "./icons";

export function SiteHeader({
  githubUrl,
  npmUrl,
  searchIndex,
}: {
  githubUrl: string;
  npmUrl: string;
  searchIndex: IndexEntry[];
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Palette keeps its own open state behind a global ⌘K listener, so the
     button opens it by dispatching that same keystroke. */
  const openPalette = () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true }),
    );

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="site-header-inner">
        <Link href="/" className="wordmark">
          moco
        </Link>
        <nav aria-label="Site">
          <Link href="/components">Components</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/docs/mcp">MCP</Link>
          <button
            type="button"
            className="header-search"
            onClick={openPalette}
            aria-label="Search (Command K)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.8-3.8" />
            </svg>
            <span className="header-search-label">Search</span>
            <kbd aria-hidden="true">⌘K</kbd>
          </button>
          <a
            href={githubUrl}
            rel="noreferrer"
            className="icon-link"
            aria-label="moco on GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href={npmUrl}
            rel="noreferrer"
            className="icon-link"
            aria-label="moco-mcp on npm"
          >
            <NpmIcon />
          </a>
        </nav>
      </div>
      <Palette index={searchIndex} onNavigate={(href) => router.push(href)} />
    </header>
  );
}
