import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CopyButton } from "../../copy-button";
import { FramePreview } from "../../frame-preview";
import { demos } from "../../demos";
import { GETTING_STARTED } from "../../docs-nav";
import { Pager } from "../../pager";
import { depName, displayDesc, getItem, listItems } from "../../registry";
import { REGISTRY_URL } from "../../site";

export const dynamicParams = false;

const FRAMED: Record<string, { height?: number; desktop?: boolean }> = {
  dotgrid: { height: 420 },
  hooks: { height: 520 },
  island: { height: 520 },
  rail: { height: 520, desktop: true },
  palette: { height: 480 },
};

export function generateStaticParams() {
  return listItems().map((item) => ({ name: item.name }));
}

type Props = { params: Promise<{ name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const item = getItem(name);
  if (!item) return {};
  return {
    title: `${item.name} · moco`,
    description: displayDesc(item.description),
  };
}

function Snippet({ file, code }: { file: string; code: string }) {
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span>{file}</span>
        <CopyButton text={code} />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default async function ComponentPage({ params }: Props) {
  const { name } = await params;
  const item = getItem(name);
  if (!item) notFound();

  const Demo = demos[item.name];
  const deps = item.dependencies ?? [];
  const regDeps = (item.registryDependencies ?? []).map(depName);

  const names = listItems()
    .map((i) => i.name)
    .sort();
  const idx = names.indexOf(item.name);
  const prev =
    idx > 0
      ? { href: `/components/${names[idx - 1]}`, label: names[idx - 1] }
      : GETTING_STARTED[GETTING_STARTED.length - 1];
  const next =
    idx < names.length - 1
      ? { href: `/components/${names[idx + 1]}`, label: names[idx + 1] }
      : undefined;

  return (
    <article className="doc">
      <header className="doc-header">
        <h1>{item.name}</h1>
        <p className="lede">{displayDesc(item.description)}</p>
        <p className="chips">
          {(item.meta?.tags ?? []).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </p>
      </header>

      <section aria-labelledby="preview-h">
        <h2 id="preview-h">Preview</h2>
        {FRAMED[item.name] ? (
          <div className="demo-panel demo-panel-framed">
            <FramePreview name={item.name} {...FRAMED[item.name]} />
          </div>
        ) : Demo ? (
          <div className="demo-panel">
            <Demo />
          </div>
        ) : (
          <p className="none-note">
            No visual demo. This item is setup, not UI. The whole site is
            styled by it.
          </p>
        )}
      </section>

      <section aria-labelledby="install-h">
        <h2 id="install-h">Installation</h2>
        <div className="install-block">
          <h3>Ask Claude (MCP)</h3>
          <p>
            With the <Link href="/docs/mcp">MCP server</Link> configured, just
            ask:
          </p>
          <Snippet file="Claude" code={`add the moco ${item.name} component`} />
        </div>
        <div className="install-block">
          <h3>shadcn CLI</h3>
          <Snippet
            file="Terminal"
            code={`npx shadcn@latest add ${REGISTRY_URL}/r/${item.name}.json`}
          />
        </div>
        <div className="install-block">
          <h3>Manual</h3>
          <p>Copy each file from the Source section into its target path:</p>
          <div className="codeblock">
            <pre>
              <code>
                {item.files.map((f) => `${f.path}  →  ${f.target}`).join("\n")}
              </code>
            </pre>
          </div>
        </div>
        {(deps.length > 0 || regDeps.length > 0) && (
          <p className="deps">
            {deps.length > 0 && (
              <>
                npm dependencies:{" "}
                {deps.map((d, i) => (
                  <span key={d}>
                    {i > 0 && ", "}
                    <code>{d}</code>
                  </span>
                ))}
                {regDeps.length > 0 && ". "}
              </>
            )}
            {regDeps.length > 0 && (
              <>
                Needs moco items:{" "}
                {regDeps.map((d, i) => (
                  <span key={d}>
                    {i > 0 && ", "}
                    <Link href={`/components/${d}`}>{d}</Link>
                  </span>
                ))}
              </>
            )}
          </p>
        )}
      </section>

      {item.docs && (
        <section aria-labelledby="usage-h">
          <h2 id="usage-h">Usage</h2>
          <Snippet file="usage.tsx" code={item.docs} />
        </section>
      )}

      <section aria-labelledby="source-h">
        <h2 id="source-h">Source</h2>
        {item.files.map((f) => (
          <details key={f.path} className="source-file">
            <summary>{f.target}</summary>
            {f.content ? (
              <>
                <div className="source-bar">
                  <CopyButton text={f.content} />
                </div>
                <pre>
                  <code>{f.content}</code>
                </pre>
              </>
            ) : (
              <p className="none-note">Content not inlined in the registry.</p>
            )}
          </details>
        ))}
      </section>

      <Pager prev={prev} next={next} />
    </article>
  );
}
