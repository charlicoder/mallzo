import Link from "next/link";
import ProductCard from "./ProductCard";
import { localizeCard, type ProductList } from "@/lib/api";
import { dict, type Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  /** undefined = API failed, null = nothing found */
  data: ProductList | null | undefined;
  page: number;
  hrefFor: (page: number) => string;
  emptyHref: string;
  /** Shown instead of "No products found" when the whole section has nothing yet. */
  emptyOverride?: { emoji: string; title: string; text: string };
};

// Product grid + pagination, shared by the home page and the category pages.
export default function ProductListing({ lang, data, page, hrefFor, emptyHref, emptyOverride }: Props) {
  const t = dict[lang];
  return (
    <>
      <div className="pt-8 sm:pt-10">
        {data === undefined ? (
          <Empty emoji="🔌" title={t.loadFail} text={t.loadFailHint} />
        ) : data === null || data.results.length === 0 ? (
          emptyOverride ? (
            <Empty {...emptyOverride} />
          ) : (
            <Empty emoji="🔍" title={t.noProducts} text={t.noProductsHint} action={{ href: emptyHref, label: t.browseAll }} />
          )
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 xl:grid-cols-4">
            {data.results.map((p, i) => (
              <ProductCard key={p.slug} product={localizeCard(p, lang)} index={i} />
            ))}
          </div>
        )}
      </div>

      {data && (data.previous || data.next) && (
        <nav className="mt-12 flex items-center justify-center gap-3" aria-label={t.pagination}>
          {data.previous && (
            <PageLink href={hrefFor(page - 1)}>
              <span className="inline-block rtl:rotate-180">←</span> {t.prev}
            </PageLink>
          )}
          <span className="text-sm font-semibold text-slate-500">{t.page(page)}</span>
          {data.next && (
            <PageLink href={hrefFor(page + 1)}>
              {t.next} <span className="inline-block rtl:rotate-180">→</span>
            </PageLink>
          )}
        </nav>
      )}
    </>
  );
}

function PageLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand shadow-sm ring-1 ring-slate-200 transition hover:bg-brand hover:text-white">
      {children}
    </Link>
  );
}

function Empty({ emoji, title, text, action }: { emoji: string; title: string; text: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-3xl bg-white py-16 text-center ring-1 ring-slate-200">
      <div className="text-5xl">{emoji}</div>
      <p className="mt-3 text-lg font-bold">{title}</p>
      <p className="text-sm text-slate-500">{text}</p>
      {action && <Link href={action.href} className="mt-5 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white">{action.label}</Link>}
    </div>
  );
}
