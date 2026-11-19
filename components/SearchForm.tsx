import { dict, type Locale } from "@/lib/i18n";

// Plain GET form (no JS needed): submits to /?q=…
export default function SearchForm({ lang, defaultValue = "", withButton = false }: { lang: Locale; defaultValue?: string; withButton?: boolean }) {
  const t = dict[lang];
  return (
    <form action="/" method="get" role="search" className="relative flex w-full items-center">
      <svg className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchAria}
        className={`h-12 w-full rounded-full border border-slate-200 bg-white ps-11 text-[15px] outline-none placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-rose-100 ${withButton ? "pe-28" : "pe-4"}`}
      />
      {withButton && (
        <button type="submit" className="absolute end-1.5 h-9 rounded-full bg-brand px-5 text-sm font-bold text-white transition hover:brightness-95">
          {t.heroSearchBtn}
        </button>
      )}
    </form>
  );
}
