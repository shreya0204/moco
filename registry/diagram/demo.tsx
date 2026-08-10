import * as React from "react";
import {
  Dgm,
  DgmRow,
  DgmBlock,
  DgmDiamond,
  DgmBracket,
  DgmNote,
  DgmLegend,
} from "./diagram";

export default function DiagramDemo() {
  return (
    <div style={{ overflowX: "auto" }}>
      <Dgm minWidth={520}>
        <DgmRow label="request">
          <DgmBlock label="Client" sub="browser" />
          <DgmDiamond label="tls" />
          <DgmBlock label="Edge" variant="active" tip="Terminates TLS, caches static assets" />
          <DgmBlock label="Origin" sub="app server" grow={2} />
        </DgmRow>
        <DgmRow label="failure" note="Retries stop after the third attempt.">
          <DgmBlock label="Queue" variant="dashed" />
          <DgmBlock label="Dead letter" variant="warn" />
          <DgmBlock label="(unused)" variant="ghost" />
        </DgmRow>
        <DgmBracket span={2} offset={1} total={3}>
          retry path
        </DgmBracket>
        <DgmNote>Every label here is selectable text.</DgmNote>
        <DgmLegend
          items={[
            { color: "accent", label: "hot path" },
            { color: "warn", label: "failure" },
            { color: "faint", label: "optional" },
          ]}
        />
      </Dgm>
    </div>
  );
}
