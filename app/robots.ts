import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/*?q=", "/*?*page=", "/wp/", "/api/"] }],
    sitemap: abs("/sitemap.xml"),
    host: abs("/"),
  };
}
