import { ImageResponse } from "next/og";

export const alt = "moco · components for people who write";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#fcfbf9",
          color: "#141414",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 140, fontStyle: "italic", lineHeight: 1 }}>moco</div>
        <div style={{ fontSize: 40, marginTop: 28, color: "#3d3d3d" }}>
          editorial react components, for people who write.
        </div>
        <div style={{ display: "flex", marginTop: 48 }}>
          <div
            style={{
              background: "#c6f24e",
              color: "#14180a",
              fontSize: 26,
              padding: "10px 28px",
              borderRadius: 999,
            }}
          >
            scrollytelling · margin notes · sparklines · diagrams · mcp
          </div>
        </div>
      </div>
    ),
    size,
  );
}
