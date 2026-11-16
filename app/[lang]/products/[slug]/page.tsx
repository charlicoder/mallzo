import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { getProduct, localizeProduct } from "@/lib/api";
import { dict, hasLocale, locales } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const raw = await getProduct(slug).catch(() => null);
  if (!raw) return {};
  const p = localizeProduct(raw, lang);
  const img = p.variants[0]?.images[0]?.url;
  return {
    title: p.title,
    description: p.subtitle || p.title,
    openGraph: { title: p.title, description: p.subtitle, images: img ? [img] : [], locale: lang },
    alternates: {
      canonical: `/${lang}/products/${slug}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/products/${slug}`])),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const raw = await getProduct(slug);
  if (!raw) notFound();
  const product = localizeProduct(raw, lang);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <Link href={`/${lang}`} className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-brand">
        <span className="inline-block rtl:rotate-180">←</span> {dict[lang].back}
      </Link>
      <ProductView product={product} lang={lang} />
    </div>
  );
}
