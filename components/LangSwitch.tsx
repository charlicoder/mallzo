"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { dict, locales, type Locale } from "@/lib/i18n";

export default function LangSwitch({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const other = locales.find((l) => l !== lang)!;
  const target = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`);

  // Warm the other language's page so the switch feels instant.
  useEffect(() => {
    router.prefetch(target);
  }, [router, target]);

  return (
    <a
      href={target}
      hrefLang={other}
      lang={other}
      onClick={(e) => {
        e.preventDefault();
        document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=31536000; samesite=lax`;
        startTransition(() => router.push(target + window.location.search)); // keep filters/search
      }}
      aria-busy={pending}
      className={`ms-auto flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 ${pending ? "animate-pulse opacity-70" : ""}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.500 18.300 12 21c-2.500-2.700-3.800-5.700-3.800-9S9.500 5.700 12 3Z" />
      </svg>
      {dict[lang].language}
    </a>
  );
}
