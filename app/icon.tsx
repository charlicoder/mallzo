import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Brand mark: used as the site icon and as the Organization logo in structured data.
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fc5924", color: "#fff", fontSize: 340, fontWeight: 700, borderRadius: 256 }}>
        M
      </div>
    ),
    size,
  );
}
