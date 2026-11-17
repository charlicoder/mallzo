"use client";

import { useRef } from "react";
import { dict, type Locale } from "@/lib/i18n";

// Horizontal scroll-snap row. Swipe on touch; arrow buttons on desktop (RTL-aware).
export default function ScrollRow({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const t = dict[lang];
  const rtl = lang === "ar";

  // dir: +1 = forward (towards the end of the row). scrollBy is physical, so flip it in RTL.
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const btn =
    "absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-lg text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-brand hover:text-white lg:grid";

  return (
    <div className="group/row relative">
      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-8 sm:gap-6 sm:scroll-px-8 sm:px-8"
      >
        {children}
      </div>
      <button type="button" aria-label={t.scrollPrev} onClick={() => scroll(-1)} className={`${btn} -start-4`}>
        <span className="rtl:rotate-180">←</span>
      </button>
      <button type="button" aria-label={t.scrollNext} onClick={() => scroll(1)} className={`${btn} -end-4`}>
        <span className="rtl:rotate-180">→</span>
      </button>
    </div>
  );
}
