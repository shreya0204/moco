import { FigurePlate, EdTable } from "./figure";

export default function FigureDemo() {
  return (
    <>
      <FigurePlate
        wide={false}
        lead="Latency falls with cache depth."
        caption="Each bar is the median of 1,000 runs against the same prefix."
      >
        <svg viewBox="0 0 240 80" width="240" height="80" role="img" aria-label="Three bars falling in height">
          <rect x="20" y="10" width="40" height="60" fill="var(--moco-accent)" />
          <rect x="100" y="30" width="40" height="40" fill="var(--moco-accent)" />
          <rect x="180" y="50" width="40" height="20" fill="var(--moco-accent)" />
        </svg>
      </FigurePlate>

      <EdTable
        head={[{ label: "Strategy" }, { label: "$/month", numeric: true }, { label: "vs. baseline", numeric: true }]}
        rows={[
          ["No caching", "$1,284", "1.00×"],
          ["5-minute TTL", "$212", "6.06×"],
          ["1-hour TTL", "$318", "4.04×"],
        ]}
        summary={["Best", "$212", "6.06×"]}
        bestIndex={1}
        lead="The short TTL wins."
        caption="Steady traffic keeps the cache warm, so the cheaper write premium dominates."
      />
    </>
  );
}
