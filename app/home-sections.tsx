import Link from "next/link";
import BrandHero from "@/components/BrandHero";
import ProductCard from "@/components/ProductCard";
import ProductListing from "@/components/ProductListing";
import ScrollRow from "@/components/ScrollRow";
import { localizeCard, type ProductCardData, type ProductList } from "@/lib/api";
import { dict, type Locale } from "@/lib/i18n";

const ROW_SIZE = 12;

export async function HomeHero({ lang, heroP }: { lang: Locale; heroP: Promise<ProductCardData[]> }) {
  const hero = await heroP;
  return (
    <BrandHero
      lang={lang}
      products={hero.filter((p) => p.images[0]).map((p) => ({ slug: p.slug, title: localizeCard(p, lang).title, image: p.images[0] }))}
    />
  );
}

// One category row. Renders nothing for a category without products.
export async function CategoryRow({
  lang, slug, index, dataP,
}: { lang: Locale; slug: string; index: number; dataP: Promise<ProductList | null | undefined> }) {
  const t = dict[lang];
  const data = await dataP;
  if (data === undefined) {
    return index === 0 ? <ProductListing lang={lang} data={undefined} page={1} hrefFor={() => "/"} emptyHref="/" /> : null;
  }
  if (!data || data.results.length === 0) return null;
  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-slate-200 pb-3 sm:mb-5">
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{t.categories[slug]}</h2>
        <Link href={`/${slug}`} className="whitespace-nowrap text-sm font-semibold text-brand hover:underline">
          {t.viewAll} <span className="inline-block rtl:rotate-180">→</span>
        </Link>
      </div>
      <ScrollRow lang={lang}>
        {data.results.slice(0, ROW_SIZE).map((p, i) => (
          <div key={p.slug} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[23.5%]">
            <ProductCard product={localizeCard(p, lang)} index={index === 0 ? i : index === 1 && i < 4 ? 4 + i : 99} />
          </div>
        ))}
      </ScrollRow>
    </div>
  );
}

export async function SearchResults({ lang, q, page, dataP }: { lang: Locale; q: string; page: number; dataP: Promise<ProductList | null | undefined> }) {
  return (
    <ProductListing
      lang={lang}
      data={await dataP}
      page={page}
      hrefFor={(p) => `/?${new URLSearchParams({ q, page: String(p) })}`}
      emptyHref="/"
    />
  );
}
