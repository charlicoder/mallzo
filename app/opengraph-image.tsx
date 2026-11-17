import { ImageResponse } from "next/og";

export const alt = "Mallzo — Handpicked style. Best prices.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social-share card for pages without their own image.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: 80, background: "linear-gradient(135deg,#fff3ec,#ffe0d0 55%,#fdc3a8)", color: "#303438",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: "#fc5924", color: "#fff", fontSize: 60, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>M</div>
          <div style={{ fontSize: 88, fontWeight: 700 }}>mallzo</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>Handpicked style. Best prices.</div>
        <div style={{ marginTop: 24, fontSize: 32, color: "#5b6168" }}>Fashion · Bags · Beauty · Home</div>
      </div>
    ),
    size,
  );
}
