import { CodeTabs, Walkthrough } from "./code";

const BEFORE = `function greet(name) {
  return "Hello, " + name + "!";
}
`;

const AFTER = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
`;

export default function Demo() {
  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      <CodeTabs
        tabs={[
          { label: "before", filename: "greet.js", lang: "js", code: BEFORE, highlight: [2], highlightTone: "warn" },
          { label: "after", filename: "greet.ts", lang: "ts", code: AFTER, highlight: [2] },
        ]}
      />

      <Walkthrough
        filename="counter.ts"
        lang="ts"
        regions={[
          {
            id: "state",
            label: "State",
            note: "A single mutable count, closed over by the returned functions.",
            code: `let count = 0;\n`,
          },
          {
            id: "api",
            label: "API",
            note: "Increment and read — the only two ways in.",
            code: `export const inc = () => ++count;\nexport const get = () => count;\n`,
          },
        ]}
        blocks={[
          { id: "state", label: "count", sub: "module state" },
          { id: "api", label: "inc / get", sub: "public api" },
        ]}
      />
    </div>
  );
}
