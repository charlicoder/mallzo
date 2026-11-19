import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Mallzo — Handpicked style. Best prices.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social-share card for pages without their own image.
export default async function OgImage() {
  const mark = `data:image/png;base64,${(await readFile(path.join(process.cwd(), "public/logo-mark.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
          padding: 80, background: "linear-gradient(135deg,#fff1f2,#ffe0e4 55%,#ffc2cb)", color: "#303438",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={mark} width={110} height={110} alt="" style={{ borderRadius: 24 }} />
          <div style={{ fontSize: 88, fontWeight: 700 }}>mallzo</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>Handpicked style. Best prices.</div>
        <div style={{ marginTop: 24, fontSize: 32, color: "#5b6168" }}>Fashion · Bags · Beauty · Home</div>
      </div>
    ),
    size,
  );
}
