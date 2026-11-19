import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { abs, SITE_NAME } from "./site";
import type { ProductDetail } from "./api";

/** Trim to a snippet-friendly length without cutting mid-word. */
export function snippet(text: string, max = 158) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

// A page's openGraph/twitter replace the layout's (they are not merged), so build the full set here.
export function pageMeta(o: {
  title: string;
  description: string;
  path: string;
  lang: Locale;
  image?: string;
  noindex?: boolean;
  absoluteTitle?: boolean;
}): Metadata {
  const image = o.image ?? abs("/opengraph-image");
  const title = o.absoluteTitle ? { absolute: o.title } : o.title;
  return {
    title,
    description: snippet(o.description),
    alternates: { canonical: o.path },
    ...(o.noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: abs(o.path),
      title: o.title,
      description: snippet(o.description),
      locale: o.lang === "ar" ? "ar_AR" : "en_US",
      images: [{ url: image, alt: o.title }],
    },
    twitter: { card: "summary_large_image", title: o.title, description: snippet(o.description), images: [image] },
  };
}

// ───────── JSON-LD (schema.org) ─────────
type Json = Record<string, unknown>;

export const breadcrumbLd = (items: { name: string; path: string }[]): Json => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

export const organizationLd = (): Json => ({
  "@type": "Organization",
  "@id": abs("/#org"),
  name: SITE_NAME,
  url: abs("/"),
  logo: abs("/icon.png"),
});

export const websiteLd = (): Json => ({
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: abs("/"),
  name: SITE_NAME,
  publisher: { "@id": abs("/#org") },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: abs("/?q={search_term_string}") },
    "query-input": "required name=search_term_string",
  },
});

function parsePrice(s: string): { value: number; currency: string } | null {
  const m = s.replace(/,/g, "").match(/\d+(\.\d+)?/);
  if (!m) return null;
  const currency = s.includes("£") ? "GBP" : s.includes("€") ? "EUR" : "USD";
  return { value: Number(m[0]), currency };
}

export function productLd(p: ProductDetail, path: string): Json {
  const images = p.variants.flatMap((v) => v.images.map((i) => i.url)).filter((u, i, a) => a.indexOf(u) === i).slice(0, 8);
  const prices = p.variants.map((v) => (v.price ? parsePrice(v.price) : null)).filter((x): x is NonNullable<typeof x> => !!x);
  const inStock = p.variants.some((v) => !v.unavailable);
  const availability = `https://schema.org/${inStock ? "InStock" : "OutOfStock"}`;

  let offers: Json | undefined;
  if (prices.length) {
    const vals = prices.map((x) => x.value);
    const [lo, hi] = [Math.min(...vals), Math.max(...vals)];
    offers =
      lo === hi
        ? { "@type": "Offer", price: lo, priceCurrency: prices[0].currency, availability, url: abs(path) }
        : { "@type": "AggregateOffer", lowPrice: lo, highPrice: hi, offerCount: prices.length, priceCurrency: prices[0].currency, availability, url: abs(path) };
  }

  return {
    "@type": "Product",
    "@id": `${abs(path)}#product`,
    name: p.title,
    description: p.subtitle || p.title,
    sku: p.asin,
    url: abs(path),
    ...(images.length && { image: images }),
    ...(p.brand && { brand: { "@type": "Brand", name: p.brand } }),
    ...(offers && { offers }),
  };
}
