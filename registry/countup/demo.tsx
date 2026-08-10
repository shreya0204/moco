import { CountUp } from "./countup";

export default function CountUpDemo() {
  return (
    <p style={{ fontFamily: "var(--moco-serif)", color: "var(--moco-body)" }}>
      Uncached, you pay <CountUp value={1284.5} as="usd" /> a month across{" "}
      <CountUp value={42_000} as="compact" /> requests — and{" "}
      <CountUp value={97.4} as="percent" /> of them hit the same{" "}
      <CountUp value={12_500} as="int" />-token prefix.
    </p>
  );
}
