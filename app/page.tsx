import Link from "next/link";
import BrandHero from "@/components/BrandHero";
import ProductCard from "@/components/ProductCard";
import ProductListing from "@/components/ProductListing";
import ScrollRow from "@/components/ScrollRow";
import SearchForm from "@/components/SearchForm";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getHero, getProducts, localizeCard } from "@/lib/api";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { organizationLd, pageMeta, websiteLd } from "@/lib/seo";
import { MENU } from "@/lib/taxonomy";

const ROW_SIZE = 12;

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
export default async function Home({ searchParams }: PageProps<"/">) {
  const lang = await getLocale();
  const t = dict[lang];
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";

  if (q) {
    const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
    const data = await getProducts(page, q).catch(() => undefined);
    return (
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="max-w-2xl"><SearchForm lang={lang} defaultValue={q} /></div>
        <h1 className="mt-6 text-xl font-extrabold sm:text-2xl">{t.searchResults(q)}</h1>
        <ProductListing
          lang={lang}
          data={data}
          page={page}
          hrefFor={(p) => `/?${new URLSearchParams({ q, page: String(p) })}`}
          emptyHref="/"
        />
      </section>
    );
  }

  const [hero, rows] = await Promise.all([
    getHero("").catch(() => null),
    Promise.all(
    MENU.map(async (c) => ({ slug: c.slug, data: await getProducts(1, "", c.slug).catch(() => undefined) })),
    ),
  ]);
  const failed = rows.every((r) => r.data === undefined);
  const visible = rows.filter((r) => r.data && r.data.results.length > 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <BrandHero
        lang={lang}
        products={(hero ?? [])
          .filter((p) => p.images[0])
          .map((p) => ({ slug: p.slug, title: localizeCard(p, lang).title, image: p.images[0] }))}
      />
      <div className="space-y-10 pt-10 sm:space-y-14 sm:pt-14">
      {failed ? (
        <ProductListing lang={lang} data={undefined} page={1} hrefFor={() => "/"} emptyHref="/" />
      ) : visible.length === 0 ? (
        <ProductListing lang={lang} data={null} page={1} hrefFor={() => "/"} emptyHref="/" />
      ) : (
        visible.map((r, ri) => (
          <div key={r.slug}>
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-slate-200 pb-3 sm:mb-5">
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{t.categories[r.slug]}</h2>
              <Link href={`/${r.slug}`} className="whitespace-nowrap text-sm font-semibold text-brand hover:underline">
                {t.viewAll} <span className="inline-block rtl:rotate-180">→</span>
              </Link>
            </div>
            <ScrollRow lang={lang}>
              {r.data!.results.slice(0, ROW_SIZE).map((p, i) => (
                <div key={p.slug} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[23.5%]">
                  <ProductCard product={localizeCard(p, lang)} index={ri === 0 ? i : ri === 1 && i < 4 ? 4 + i : 99} />
                </div>
              ))}
            </ScrollRow>
          </div>
        ))
      )}
      </div>
    </section>
  );
}
