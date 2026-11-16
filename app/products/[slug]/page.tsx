import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { getProduct } from "@/lib/api";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug).catch(() => null);
  if (!p) return {};
  const img = p.variants[0]?.images[0]?.url;
  return {
    title: p.title,
    description: p.subtitle || p.title,
    openGraph: { title: p.title, images: img ? [img] : [] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
      <Link href="/" className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-brand">
        ← All products
      </Link>
      <ProductView product={product} />
    </div>
  );
}
