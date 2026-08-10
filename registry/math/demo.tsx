"use client";

import * as React from "react";
import { MathBlock } from "./math";

/* In real use `children` is KaTeX or MathML output; plain markup works too. */
export default function MathDemo() {
  return (
    <MathBlock
      plain="Compound growth: the final amount is the start times the rate, applied once per period."
      derivation={
        <>
          <p>
            After one period: <code>A₁ = P(1 + r)</code>. Each subsequent period
            multiplies by <code>(1 + r)</code> again, so after <code>n</code>{" "}
            periods the factors stack: <code>A = P(1 + r)ⁿ</code>.
          </p>
        </>
      }
    >
      <p style={{ textAlign: "center", fontSize: "1.2em" }}>
        <em>A = P(1 + r)ⁿ</em>
      </p>
    </MathBlock>
  );
}
