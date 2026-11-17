import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ProductView from "@/components/ProductView";
import { getProduct, localizeProduct } from "@/lib/api";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { breadcrumbLd, pageMeta, productLd } from "@/lib/seo";
import { abs } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLocale();
  const raw = await getProduct(slug).catch(() => null);
  if (!raw) return {};
  const p = localizeProduct(raw, lang);
  const img = p.variants[0]?.images[0]?.url;
  return pageMeta({
    title: p.title,
    description: p.subtitle || p.title,
    path: `/products/${slug}`,
    lang,
    image: img,
  });
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const lang = await getLocale();
  const raw = await getProduct(slug);
  if (!raw) notFound();
  const product = localizeProduct(raw, lang);
  const path = `/products/${slug}`;
  const t = dict[lang];
  const crumbs = [
    { name: t.home, path: "/" },
    ...(product.category && t.categories[product.category] ? [{ name: t.categories[product.category], path: `/${product.category}` }] : []),
    { name: product.title, path },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <JsonLd data={[productLd(product, path), breadcrumbLd(crumbs)]} />
      <Link href="/" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-brand">
        <span className="inline-block rtl:rotate-180">←</span> {dict[lang].back}
      </Link>
      <ProductView product={product} lang={lang} shareUrl={abs(path)} />
    </div>
  );
}
