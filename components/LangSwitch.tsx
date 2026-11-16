"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { dict, locales, type Locale } from "@/lib/i18n";

// The language lives in a cookie (read on the server), so URLs never change.
export default function LangSwitch({ lang }: { lang: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const other = locales.find((l) => l !== lang)!;

  return (
    <button
      type="button"
      lang={other}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=31536000; samesite=lax`;
        startTransition(() => router.refresh()); // re-render the current page in the new language
      }}
      aria-busy={pending}
      className={`ms-auto flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 ${pending ? "animate-pulse opacity-70" : ""}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.500 18.300 12 21c-2.500-2.700-3.800-5.700-3.800-9S9.500 5.700 12 3Z" />
      </svg>
      {dict[lang].language}
    </button>
  );
}
