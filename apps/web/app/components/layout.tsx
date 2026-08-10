import { DocsShell } from "../docs-shell";

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
