"use client";

import * as React from "react";

const DESKTOP_W = 1360;

export function FramePreview({
  name,
  height = 520,
  desktop = false,
}: {
  name: string;
  height?: number;
  desktop?: boolean;
}) {
  const box = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.5);

  React.useEffect(() => {
    if (!desktop) return;
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / DESKTOP_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, [desktop]);

  const src = `/preview/${name}`;
  if (!desktop) {
    return (
      <iframe
        src={src}
        title={`${name} demo`}
        style={{ width: "100%", height, border: 0, display: "block" }}
      />
    );
  }
  return (
    <div ref={box} style={{ overflow: "hidden", height }}>
      <iframe
        src={src}
        title={`${name} demo`}
        style={{
          width: DESKTOP_W,
          height: height / scale,
          border: 0,
          display: "block",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}
