import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FilterBar from "@/components/FilterBar";
import HeroSlider from "@/components/HeroSlider";
import ProductListing from "@/components/ProductListing";
import { getCategoryStats, getHero, getProducts, localizeCard } from "@/lib/api";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { findCategory } from "@/lib/taxonomy";

export async function generateMetadata({ params }: PageProps<"/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!findCategory(category)) return {};
  const t = dict[await getLocale()];
  return { title: t.categories[category], description: t.taglines[category], alternates: { canonical: `/${category}` } };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/[category]">) {
  const { category } = await params;
  const menu = findCategory(category);
  if (!menu) notFound();

  const lang = await getLocale();
  const t = dict[lang];
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sub = typeof sp.sub === "string" && menu.subs.some((s) => s.slug === sp.sub) ? sp.sub : "";
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);

  const [data, hero, stats] = await Promise.all([
    getProducts(page, q, category, sub).catch(() => undefined),
    getHero(category).catch(() => null),
    getCategoryStats().catch(() => null),
  ]);

  // Hide sub-categories that have no products yet — unless the whole category is empty,
  // in which case show them all so the page still reads as a real shop section.
  const counts = stats?.[category];
  const hasAny = !!counts && counts.count > 0;
  const tabs = menu.subs
    .filter((s) => !hasAny || (counts!.subs[s.slug] ?? 0) > 0)
    .map((s) => ({ slug: s.slug, label: t.subs[s.slug] ?? s.slug, icon: s.icon }));

  const slides = (hero ?? [])
    .filter((p) => p.images[0])
    .map((p) => {
      const lp = localizeCard(p, lang);
      return { slug: lp.slug, title: lp.title, image: lp.images[0] };
    });

  const hrefFor = (p: number) =>
    `/${category}?${new URLSearchParams({ ...(sub && { sub }), ...(q && { q }), page: String(p) })}`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <HeroSlider lang={lang} category={category} slides={slides} />
      <FilterBar lang={lang} category={sub} q={q} count={data?.count} tabs={tabs} param="sub" basePath={`/${category}`} hideSearch />
      <ProductListing
        lang={lang}
        data={data}
        page={page}
        hrefFor={hrefFor}
        emptyHref={`/${category}`}
        emptyOverride={counts && !hasAny ? { emoji: "✨", title: t.categoryEmpty, text: t.categoryEmptyHint } : undefined}
      />
    </section>
  );
}
