import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BarSkeleton, GridSkeleton, HeroSkeleton } from "@/components/Skeletons";
import { getCategoryStats, getHero, getProducts } from "@/lib/api";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";
import { findCategory } from "@/lib/taxonomy";
import { CategoryBar, CategoryHero, CategoryList } from "./sections";

export async function generateMetadata({ params, searchParams }: PageProps<"/[category]">): Promise<Metadata> {
  const { category } = await params;
  const menu = findCategory(category);
  if (!menu) return {};
  const lang = await getLocale();
  const t = dict[lang];
  const sp = await searchParams;
  const sub = typeof sp.sub === "string" && menu.subs.some((s) => s.slug === sp.sub) ? sp.sub : "";
  const q = typeof sp.q === "string" && sp.q.trim() !== "";
  const name = sub ? `${t.subs[sub]} — ${t.categories[category]}` : t.categories[category];
  return pageMeta({
    title: name,
    description: `${t.taglines[category]}. ${sub ? t.subs[sub] + " · " : ""}${t.siteDescription}`,
    path: sub ? `/${category}?sub=${sub}` : `/${category}`,
    lang,
    noindex: q,
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/[category]">) {
  const { category } = await params;
  const menu = findCategory(category);
  if (!menu) notFound();

  const lang = await getLocale();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sub = typeof sp.sub === "string" && menu.subs.some((s) => s.slug === sp.sub) ? sp.sub : "";
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);

  // Start all three requests at once, but don't wait: each section streams in when its data arrives.
  const dataP = getProducts(page, q, category, sub).catch(() => undefined);
  const heroP = getHero(category).catch(() => []);
  const statsP = getCategoryStats().catch(() => null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <Suspense fallback={<HeroSkeleton />}>
        <CategoryHero lang={lang} category={category} heroP={heroP} />
      </Suspense>
      <Suspense fallback={<BarSkeleton />}>
        <CategoryBar lang={lang} menu={menu} sub={sub} q={q} dataP={dataP} statsP={statsP} />
      </Suspense>
      <Suspense fallback={<GridSkeleton />}>
        <CategoryList lang={lang} category={category} sub={sub} q={q} page={page} dataP={dataP} statsP={statsP} />
      </Suspense>
    </section>
  );
}
