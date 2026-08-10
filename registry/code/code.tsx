import * as React from "react";
import { codeToHtml } from "shiki";
import { CodeTabsClient, WalkthroughClient, type Region } from "./code-client";
import "./code.css";

/** A light TextMate theme keyed to the moco palette. Keywords take the one accent. */
const LIGHT = {
  name: "moco-plate",
  type: "light",
  colors: {
    "editor.background": "#fcfbf9",
    "editor.foreground": "#242424",
  },
  settings: [
    { settings: { foreground: "#242424", background: "#fcfbf9" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#8a8477", fontStyle: "italic" },
    },
    {
      scope: ["string", "string.quoted", "constant.other.symbol", "meta.embedded.line"],
      settings: { foreground: "#3f6d33" },
    },
    {
      scope: ["keyword", "storage", "storage.type", "keyword.control", "keyword.operator.new"],
      settings: { foreground: "#5b770c" },
    },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#7a4b9c" } },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call.generic"],
      settings: { foreground: "#1a1a1a" },
    },
    {
      scope: ["variable", "meta.definition.variable", "support.type"],
      settings: { foreground: "#242424" },
    },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: "#8a8477" } },
  ],
} as const;

/** Dark twin: warm near-black ground (the dark token palette), lime takes keyword duty. */
const DARK = {
  name: "moco-plate-dark",
  type: "dark",
  colors: {
    "editor.background": "#121110",
    "editor.foreground": "#dedcd7",
  },
  settings: [
    { settings: { foreground: "#dedcd7", background: "#121110" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#8a8477", fontStyle: "italic" },
    },
    {
      scope: ["string", "string.quoted", "constant.other.symbol", "meta.embedded.line"],
      settings: { foreground: "#a9c98a" },
    },
    {
      scope: ["keyword", "storage", "storage.type", "keyword.control", "keyword.operator.new"],
      settings: { foreground: "#c6f24e" },
    },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: "#c9a1ec" } },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call.generic"],
      settings: { foreground: "#f2f0ec" },
    },
    {
      scope: ["variable", "meta.definition.variable", "support.type"],
      settings: { foreground: "#dedcd7" },
    },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: "#8a8477" } },
  ],
} as const;

export type { Region };

export interface Snippet {
  label: string;
  filename: string;
  lang: string;
  code: string;
  /** 1-indexed lines to band. Use "warn" to band them in --moco-warn instead. */
  highlight?: number[];
  highlightTone?: "true" | "warn";
  /** Where line numbering starts, for excerpted regions. */
  startLine?: number;
}

async function render(s: Snippet): Promise<string> {
  const hl = new Set(s.highlight ?? []);
  const tone = s.highlightTone ?? "true";
  return codeToHtml(s.code.replace(/\n$/, ""), {
    lang: s.lang,
    // Dual themes: tokens carry --shiki-light/--shiki-dark vars (defaultColor:
    // false); code.css switches between them with the color scheme.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    themes: { light: LIGHT as any, dark: DARK as any },
    defaultColor: false,
    transformers: [
      {
        line(node, line) {
          if (hl.has(line)) node.properties["data-hl"] = tone;
        },
      },
    ],
  });
}

/** Window chrome, line numbers, line highlights, tabs bottom-right. */
export async function CodeTabs({ tabs }: { tabs: Snippet[] }) {
  const html = await Promise.all(tabs.map(render));
  return (
    <CodeTabsClient
      labels={tabs.map((t) => t.label)}
      filenames={tabs.map((t) => t.filename)}
      panes={html.map((h, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: h }} />
      ))}
    />
  );
}

/** Two-column code walkthrough with bidirectional linked highlighting. */
export async function Walkthrough({
  filename,
  lang,
  regions,
  blocks,
}: {
  filename: string;
  lang: string;
  regions: (Region & { code: string })[];
  blocks: { id: string; label: string; sub?: string }[];
}) {
  const html = await Promise.all(
    regions.map((r) => render({ label: r.id, filename, lang, code: r.code })),
  );
  return (
    <WalkthroughClient
      filename={filename}
      regions={regions.map(({ id, label, note }) => ({ id, label, note }))}
      panes={html.map((h, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: h }} />
      ))}
      blocks={blocks}
    />
  );
}
