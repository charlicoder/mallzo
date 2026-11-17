// Set API_URL in the host's environment. In production we fall back to the public API instead of
// localhost, which can never work on a hosted server.
const API_URL =
  process.env.API_URL ?? (process.env.NODE_ENV === "production" ? "https://api.mallzo.shop/api" : "http://localhost:8765/api");

export type ProductCardData = { slug: string; title: string; title_en: string; title_ar: string; images: string[] };
export type ProductList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductCardData[];
};
export type Img = { slot: string; url: string; thumbnail: string; full_size: string };
export type Variant = {
  id: number;
  asin: string;
  label: string;
  color: string;
  style: string;
  price: string;
  swatch_image: string;
  unavailable: boolean;
  videos: string[];
  images: Img[];
};
export type ProductDetail = {
  slug: string;
  asin: string;
  title: string;
  subtitle: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  brand: string;
  affiliate_link: string;
  affiliate_site: string;
  category?: string;
  category_path: string;
  categories: string[];
  tags: string[];
  sizes: string[];
  videos: string[];
  variants: Variant[];
};

export const CATEGORIES = [
  { slug: "apparel", label: "Apparel" },
  { slug: "footwear-bags", label: "Footwear & Bags" },
  { slug: "beauty-health", label: "Beauty, Skincare & Health Care" },
  { slug: "home-living", label: "Home & Living" },
];

async function get<T>(path: string): Promise<T | null> {
  // Cached in Next's data cache: one entry per URL, shared by both languages (no ?lang= in the key).
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 300, tags: ["products"] } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return res.json();
}

export function getProducts(page = 1, q = "", category = "", sub = "") {
  const qs = new URLSearchParams({ page: String(page) });
  if (q) qs.set("q", q);
  if (category) qs.set("category", category);
  if (sub) qs.set("sub", sub);
  return get<ProductList>(`/products/?${qs}`);
}

// Hero slides. If the API predates /hero/ (404) or it fails, fall back to the first products of the category.
export async function getHero(category: string): Promise<ProductCardData[]> {
  const hero = await get<ProductCardData[]>(`/hero/?category=${encodeURIComponent(category)}`).catch(() => null);
  if (hero) return hero;
  const list = await getProducts(1, "", category).catch(() => null);
  return (list?.results ?? []).filter((p) => p.images[0]).slice(0, 5);
}
export type CategoryStats = Record<string, { count: number; subs: Record<string, number> }>;
export const getCategoryStats = () => get<CategoryStats>("/categories/");

export const getProduct = (slug: string) => get<ProductDetail>(`/products/${slug}/`);

// Pick the text for a language: title_ar for Arabic, title_en for English (with sensible fallbacks).
const pickText = (lang: string, en: string, ar: string, fallback: string) =>
  (lang === "ar" ? ar || en : en) || fallback;

export const localizeCard = (p: ProductCardData, lang: string): ProductCardData => ({
  ...p,
  title: pickText(lang, p.title_en, p.title_ar, p.title),
});

export const localizeProduct = (p: ProductDetail, lang: string): ProductDetail => ({
  ...p,
  title: pickText(lang, p.title_en, p.title_ar, p.title),
  subtitle: pickText(lang, p.subtitle_en, p.subtitle_ar, p.subtitle),
});
