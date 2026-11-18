import { ImageResponse } from "next/og";
import { brandMark } from "@/lib/brandMark";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Site icon / favicon and the Organization logo in structured data.
export default function Icon() {
  return new ImageResponse(brandMark(512), size);
}
