import { Spark, SparkBar } from "./spark";

export default function SparkDemo() {
  return (
    <p style={{ fontFamily: "var(--moco-serif)", color: "var(--moco-body)" }}>
      Latency trended down <Spark data={[9, 7, 8, 5, 4, 4, 2]} /> over the quarter, error rate
      spiked once <Spark data={[1, 1, 6, 2, 1]} tone="warn" dot={false} label="error rate spike" />,
      and cache hit rate sits at <SparkBar value={0.82} label="82 percent cache hit rate" /> 82%.
    </p>
  );
}
