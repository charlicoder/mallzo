import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { abs } from "@/lib/site";
import { MENU } from "@/lib/taxonomy";

export const dynamic = "force-dynamic"; // built per request (API data is cached 5 min), not at build time

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: abs("/"), changeFrequency: "daily", priority: 1 },
    ...MENU.map((c) => ({ url: abs(`/${c.slug}`), changeFrequency: "daily" as const, priority: 0.9 })),
  ];

  const products: MetadataRoute.Sitemap = [];
  try {
    for (let page = 1; page <= 200; page++) {
      const data = await getProducts(page);
      if (!data) break;
      for (const p of data.results) {
        products.push({
          url: abs(`/products/${p.slug}`),
          changeFrequency: "weekly",
          priority: 0.7,
          ...(p.images[0] && { images: [p.images[0]] }),
        });
      }
      if (!data.next) break;
    }
  } catch {
    // API unreachable: still serve the static pages
  }
  return [...pages, ...products];
}
