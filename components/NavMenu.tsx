"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dict, type Locale } from "@/lib/i18n";
import { MENU } from "@/lib/taxonomy";

const pill = (on: boolean) =>
  `block whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] xl:px-3.5 font-bold uppercase tracking-wide transition ${
    on ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function NavMenu({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const t = dict[lang];
  return (
    <nav aria-label={t.menuAria} className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0 [&>*:first-child]:ms-auto [&>*:last-child]:me-auto">
      {MENU.map((c) => (
        <Link key={c.slug} href={`/${c.slug}`} aria-current={pathname === `/${c.slug}` ? "page" : undefined} className={pill(pathname === `/${c.slug}`)}>
          {t.categories[c.slug]}
        </Link>
      ))}
    </nav>
  );
}
