import { listItems } from "./registry";
import { SidebarNav } from "./sidebar-nav";

/* Shared shell for /docs/* and /components/*: sticky sidebar on desktop,
   a <details> disclosure under 900px. Pages render content only — the
   <main> landmark lives here. */
export function DocsShell({ children }: { children: React.ReactNode }) {
  const names = listItems()
    .map((i) => i.name)
    .sort();

  return (
    <div className="wrap shell">
      <details className="side-mobile">
        <summary>Documentation menu</summary>
        <SidebarNav components={names} />
      </details>
      <aside className="side-desktop">
        <SidebarNav components={names} />
      </aside>
      <main id="main" className="shell-main">
        {children}
      </main>
    </div>
  );
}
