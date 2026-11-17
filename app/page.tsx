import type { Metadata } from "next";
import { Suspense } from "react";
import BrandHero from "@/components/BrandHero";
import JsonLd from "@/components/JsonLd";
import SearchForm from "@/components/SearchForm";
import { GridSkeleton, RowSkeleton } from "@/components/Skeletons";
import { getHero, getProducts } from "@/lib/api";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { organizationLd, pageMeta, websiteLd } from "@/lib/seo";
import { MENU } from "@/lib/taxonomy";
import { CategoryRow, HomeHero, SearchResults } from "./home-sections";

export async function generateMetadata({ searchParams }: PageProps<"/">): Promise<Metadata> {
  const lang = await getLocale();
  const t = dict[lang];
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  // Search-result pages are thin/duplicate content: keep them out of the index.
  return pageMeta({
    title: q ? t.searchResults(q) : t.siteTitle,
    description: t.siteDescription,
    path: "/",
    lang,
    noindex: !!q,
    absoluteTitle: !q,
  });
}

// Landing page: one horizontally scrolling row per category. A search (?q=) shows a flat grid instead.
// Every section streams in on its own, so the page shell is visible before any API call finishes.
export default async function Home({ searchParams }: PageProps<"/">) {
  const lang = await getLocale();
  const t = dict[lang];
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  if (q) {
    const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
    const dataP = getProducts(page, q).catch(() => undefined);
    return (
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="max-w-2xl"><SearchForm lang={lang} defaultValue={q} /></div>
        <h1 className="mt-6 text-xl font-extrabold sm:text-2xl">{t.searchResults(q)}</h1>
        <Suspense fallback={<GridSkeleton />}>
          <SearchResults lang={lang} q={q} page={page} dataP={dataP} />
        </Suspense>
      </section>
    );
  }

  const heroP = getHero("").catch(() => []);
  const rows = MENU.map((c) => ({ slug: c.slug, dataP: getProducts(1, "", c.slug).catch(() => undefined) }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <Suspense fallback={<BrandHero lang={lang} products={[]} />}>
        <HomeHero lang={lang} heroP={heroP} />
      </Suspense>
      <div className="space-y-10 pt-10 sm:space-y-14 sm:pt-14">
        {rows.map((r, i) => (
          // Only the first two rows get a placeholder; later (possibly empty) categories simply appear when ready.
          <Suspense key={r.slug} fallback={i < 2 ? <RowSkeleton /> : null}>
            <CategoryRow lang={lang} slug={r.slug} index={i} dataP={r.dataP} />
          </Suspense>
        ))}
      </div>
    </section>
  );
}
