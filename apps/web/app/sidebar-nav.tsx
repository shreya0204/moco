"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GETTING_STARTED } from "./docs-nav";

export function SidebarNav({ components }: { components: string[] }) {
  const pathname = usePathname();
  const item = (href: string, label: string) => (
    <li key={href}>
      <Link href={href} aria-current={pathname === href ? "page" : undefined}>
        {label}
      </Link>
    </li>
  );

  return (
    <nav className="side-nav" aria-label="Documentation">
      <p className="side-label">Getting started</p>
      <ul>{GETTING_STARTED.map((d) => item(d.href, d.label))}</ul>
      <p className="side-label">
        Components <span>{components.length}</span>
      </p>
      <ul>{components.map((n) => item(`/components/${n}`, n))}</ul>
    </nav>
  );
}
