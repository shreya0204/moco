import Link from "next/link";

import type { PageRef } from "./docs-nav";

export function Pager({ prev, next }: { prev?: PageRef; next?: PageRef }) {
  if (!prev && !next) return null;
  return (
    <nav className="pager" aria-label="Pagination">
      {prev && (
        <Link className="pager-link prev" href={prev.href}>
          <span>Previous</span>
          <strong>{prev.label}</strong>
        </Link>
      )}
      {next && (
        <Link className="pager-link next" href={next.href}>
          <span>Next</span>
          <strong>{next.label}</strong>
        </Link>
      )}
    </nav>
  );
}
