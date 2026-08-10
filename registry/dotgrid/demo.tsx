import { DotGrid } from "./dotgrid";

export default function Demo() {
  return (
    <div style={{ minHeight: "60vh" }}>
      <DotGrid />
      <p style={{ position: "relative", zIndex: 1, padding: "2rem" }}>
        Move the cursor — nearby dots brighten and drift toward it.
      </p>
    </div>
  );
}
