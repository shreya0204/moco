import { Compare } from "./compare";

export default function CompareDemo() {
  return (
    <Compare
      height={220}
      beforeLabel="draft"
      afterLabel="final"
      before={
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "var(--moco-panel)",
            color: "var(--moco-muted)",
            fontFamily: "var(--moco-mono)",
          }}
        >
          before
        </div>
      }
      after={
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "var(--moco-accent-wash)",
            color: "var(--moco-ink)",
            fontFamily: "var(--moco-mono)",
          }}
        >
          after
        </div>
      }
    />
  );
}
