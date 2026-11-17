"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/api";
import { dict, type Locale } from "@/lib/i18n";

type Tab = { slug: string; label: string; icon?: string };

// Pill tabs + search. On the home page the tabs are categories (?category=); on a category page
// they are its sub-categories (?sub=) and `basePath` is that page.
export default function FilterBar({
  lang, category, q, count, tabs: customTabs, param = "category", basePath = "/", hideTabs = false, hideSearch = false,
}: {
  lang: Locale; category: string; q: string; count?: number; tabs?: Tab[]; param?: string; basePath?: string; hideTabs?: boolean; hideSearch?: boolean;
}) {
  const t = dict[lang];
  const router = useRouter();
  const [text, setText] = useState(q);
  const first = useRef(true);

  // Debounced live search; keeps the active category.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (text === q) return;
    const t = setTimeout(() => {
      const qs = new URLSearchParams();
      if (category) qs.set(param, category);
      if (text.trim()) qs.set("q", text.trim());
      router.replace(`${basePath}${qs.size ? `?${qs}` : ""}`, { scroll: false });
    }, 350);
    return () => clearTimeout(t);
  }, [text, q, category, router, param, basePath]);

  const tabHref = (slug: string) => {
    const qs = new URLSearchParams();
    if (slug) qs.set(param, slug);
    if (q) qs.set("q", q);
    return `${basePath}${qs.size ? `?${qs}` : ""}`;
  };
  const tabs: Tab[] = [{ slug: "", label: t.all }, ...(customTabs ?? CATEGORIES.map((c) => ({ slug: c.slug, label: t.categories[c.slug] ?? c.label })))];

  return (
    <div className="border-b border-slate-200 pb-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        {!hideTabs && <nav
          aria-label={customTabs ? t.subcategoriesAria : t.categoriesAria}
          className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:flex-none"
        >
          <div className="flex gap-1 rounded-full bg-slate-100 p-1.5">
            {tabs.map((t) => {
              const on = t.slug === category;
              return (
                <Link
                  key={t.slug}
                  href={tabHref(t.slug)}
                  scroll={false}
                  aria-current={on ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-medium transition sm:px-5 ${
                    on ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.icon && <span aria-hidden className="me-1.5">{t.icon}</span>}{t.label}
                </Link>
              );
            })}
          </div>
        </nav>}

        <div className={`flex min-w-0 flex-1 items-center gap-4 lg:ml-auto lg:max-w-2xl ${hideSearch ? "justify-end" : ""}`}>
          {!hideSearch && <label className="relative block min-w-0 flex-1">
            <svg className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchAria}
              className="h-12 w-full rounded-full border border-slate-200 bg-white ps-11 pe-4 text-[15px] outline-none placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-orange-100"
            />
          </label>}
          {count !== undefined && (
            <span className="whitespace-nowrap text-[15px] font-medium text-slate-500">
              {t.count(count)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
