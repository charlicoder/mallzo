import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { getProduct, localizeProduct } from "@/lib/api";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLocale();
  const raw = await getProduct(slug).catch(() => null);
  if (!raw) return {};
  const p = localizeProduct(raw, lang);
  const img = p.variants[0]?.images[0]?.url;
  return {
    title: p.title,
    description: p.subtitle || p.title,
    openGraph: { title: p.title, description: p.subtitle, images: img ? [img] : [], locale: lang },
    alternates: { canonical: `/products/${slug}` },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const lang = await getLocale();
  const raw = await getProduct(slug);
  if (!raw) notFound();
  const product = localizeProduct(raw, lang);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <Link href="/" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-brand">
        <span className="inline-block rtl:rotate-180">←</span> {dict[lang].back}
      </Link>
      <ProductView product={product} lang={lang} />
    </div>
  );
}
