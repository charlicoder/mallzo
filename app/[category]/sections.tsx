import FilterBar from "@/components/FilterBar";
import HeroSlider from "@/components/HeroSlider";
import JsonLd from "@/components/JsonLd";
import ProductListing from "@/components/ProductListing";
import { localizeCard, type CategoryStats, type ProductCardData, type ProductList } from "@/lib/api";
import { dict, type Locale } from "@/lib/i18n";
import { breadcrumbLd } from "@/lib/seo";
import { abs } from "@/lib/site";
import type { MenuCategory } from "@/lib/taxonomy";

// Each section awaits its own (already started) request, so the page shell streams immediately
// and the hero, tabs and grid appear as soon as their data is ready.
type Data = Promise<ProductList | null | undefined>;

export async function CategoryHero({ lang, category, heroP }: { lang: Locale; category: string; heroP: Promise<ProductCardData[]> }) {
  const slides = (await heroP)
    .filter((p) => p.images[0])
    .map((p) => {
      const lp = localizeCard(p, lang);
      return { slug: lp.slug, title: lp.title, image: lp.images[0] };
    });
  return <HeroSlider lang={lang} category={category} slides={slides} />;
}

export async function CategoryBar({
  lang, menu, sub, q, dataP, statsP,
}: { lang: Locale; menu: MenuCategory; sub: string; q: string; dataP: Data; statsP: Promise<CategoryStats | null> }) {
  const t = dict[lang];
  const [data, stats] = await Promise.all([dataP, statsP]);
  // Hide sub-categories with no products — unless the whole category is empty (then show them all).
  const counts = stats?.[menu.slug];
  const hasAny = !!counts && counts.count > 0;
  const tabs = menu.subs
    .filter((s) => !hasAny || (counts!.subs[s.slug] ?? 0) > 0)
    .map((s) => ({ slug: s.slug, label: t.subs[s.slug] ?? s.slug, icon: s.icon }));
  return <FilterBar lang={lang} category={sub} q={q} count={data?.count} tabs={tabs} param="sub" basePath={`/${menu.slug}`} hideSearch />;
}

export async function CategoryList({
  lang, category, sub, q, page, dataP, statsP,
}: { lang: Locale; category: string; sub: string; q: string; page: number; dataP: Data; statsP: Promise<CategoryStats | null> }) {
  const t = dict[lang];
  const data = await dataP;
  const empty = !data || data.results.length === 0;
  const counts = empty ? (await statsP)?.[category] : undefined; // only needed to tell "empty category" from "no match"
  const hrefFor = (p: number) => `/${category}?${new URLSearchParams({ ...(sub && { sub }), ...(q && { q }), page: String(p) })}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: t.home, path: "/" }, { name: t.categories[category], path: `/${category}` }]),
          {
            "@type": "CollectionPage",
            name: t.categories[category],
            description: t.taglines[category],
            url: abs(`/${category}`),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: (data?.results ?? []).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: abs(`/products/${p.slug}`),
                name: localizeCard(p, lang).title,
              })),
            },
          },
        ]}
      />
      <ProductListing
        lang={lang}
        data={data}
        page={page}
        hrefFor={hrefFor}
        emptyHref={`/${category}`}
        emptyOverride={counts && counts.count === 0 ? { emoji: "✨", title: t.categoryEmpty, text: t.categoryEmptyHint } : undefined}
      />
    </>
  );
}
