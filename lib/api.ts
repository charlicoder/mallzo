const API_URL = process.env.API_URL ?? "http://localhost:8765/api";

export type ProductCardData = { slug: string; title: string; images: string[] };
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
  brand: string;
  affiliate_link: string;
  affiliate_site: string;
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
  { slug: "tech-audio", label: "Tech & Audio" },
  { slug: "home-living", label: "Home & Living" },
];

async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return res.json();
}

export function getProducts(page = 1, q = "", category = "") {
  const qs = new URLSearchParams({ page: String(page) });
  if (q) qs.set("q", q);
  if (category) qs.set("category", category);
  return get<ProductList>(`/products/?${qs}`);
}

export const getProduct = (slug: string) => get<ProductDetail>(`/products/${slug}/`);
