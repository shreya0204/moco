"use client";

import { Zoom } from "./zoom";

export default function ZoomDemo() {
  return (
    <figure style={{ position: "relative", maxWidth: 480, margin: 0 }}>
      <Zoom caption="A placeholder figure. Click ⤢ to enlarge, Esc or click outside to close.">
        <svg viewBox="0 0 320 180" style={{ width: "100%", display: "block", background: "var(--moco-panel)" }} role="img" aria-label="placeholder chart">
          <polyline points="10,150 80,90 150,120 220,50 310,70" fill="none" stroke="var(--moco-accent-dk)" strokeWidth="2" />
        </svg>
      </Zoom>
    </figure>
  );
}
