import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import { getProducts, localizeCard } from "@/lib/api";
import { dict } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function Home({ searchParams }: PageProps<"/">) {
  const lang = await getLocale();
  const t = dict[lang];

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
  const data = await getProducts(page, q, category).catch(() => undefined);

  const href = (p: number) =>
    `/?${new URLSearchParams({ ...(category && { category }), ...(q && { q }), page: String(p) })}`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <FilterBar lang={lang} category={category} q={q} count={data?.count} />

      <div className="pt-8 sm:pt-10">
        {data === undefined ? (
          <Empty emoji="🔌" title={t.loadFail} text={t.loadFailHint} />
        ) : data === null || data.results.length === 0 ? (
          <Empty emoji="🔍" title={t.noProducts} text={t.noProductsHint} action={{ href: "/", label: t.browseAll }} />
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
            <PageLink href={href(page - 1)}>
              <span className="inline-block rtl:rotate-180">←</span> {t.prev}
            </PageLink>
          )}
          <span className="text-sm font-semibold text-slate-500">{t.page(page)}</span>
          {data.next && (
            <PageLink href={href(page + 1)}>
              {t.next} <span className="inline-block rtl:rotate-180">→</span>
            </PageLink>
          )}
        </nav>
      )}
    </section>
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
