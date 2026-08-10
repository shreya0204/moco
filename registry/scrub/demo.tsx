"use client";

import * as React from "react";
import { ScrubNumber } from "./scrub";

const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function ScrubDemo() {
  const [reqs, setReqs] = React.useState(2_000);
  const perMonth = reqs * 30 * 0.042;

  return (
    <p style={{ fontFamily: "var(--moco-serif)", color: "var(--moco-body)" }} aria-live="polite">
      Suppose{" "}
      <ScrubNumber
        handle="n"
        label="requests per day"
        value={reqs}
        min={50}
        max={50_000}
        step={50}
        format={(v) => `${v.toLocaleString("en-US")} requests`}
        onChange={setReqs}
      />{" "}
      a day hit the same prompt — that is{" "}
      <b className="moco-num">{usd(perMonth)}</b> a month.
    </p>
  );
}
