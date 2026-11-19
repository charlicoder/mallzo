"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { dict, type Locale } from "@/lib/i18n";

export type Slide = { slug: string; title: string; image: string };

const INTERVAL = 4500;

// Small category hero: 3–5 featured products cross-fade; swipe, dots, pause on hover/touch.
export default function HeroSlider({ lang, category, slides }: { lang: Locale; category: string; slides: Slide[] }) {
  const t = dict[lang];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = slides.length;

  useEffect(() => {
    if (paused || n < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), INTERVAL);
    return () => clearInterval(id);
  }, [paused, n]);

  if (n === 0) return null;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.heroAria}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touchX.current ?? e.changedTouches[0].clientX);
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); // swipe direction is physical, so RTL needs no flip
        touchX.current = null;
        setPaused(false);
      }}
      className="relative mb-6 h-48 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fff1f2] via-[#ffe0e4] to-[#ffcdd5] sm:h-60 lg:h-72"
    >
      {slides.map((s, k) => (
        <Link
          key={s.slug}
          href={`/products/${s.slug}`}
          aria-hidden={k !== i}
          tabIndex={k === i ? 0 : -1}
          className={`absolute inset-0 flex items-center gap-4 p-5 transition-opacity duration-700 sm:gap-10 sm:p-8 lg:px-14 ${
            k === i ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-brand sm:text-sm">{t.featured}</p>
            <h2 className="mt-1 text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {t.categories[category]}
            </h2>
            <p className="mt-1 hidden text-sm text-slate-600 sm:block lg:text-base">{t.taglines[category]}</p>
            <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-700 sm:mt-4 sm:text-base">{s.title}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white sm:mt-4 sm:px-5 sm:text-sm">
              {t.shopNow} <span className="inline-block rtl:rotate-180">→</span>
            </span>
          </div>
          <div className="relative h-full w-2/5 max-w-sm shrink-0 sm:w-1/3">
            <div className="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
              <Image
                src={s.image}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 40vw"
                priority={k === 0}
                loading={k === 0 ? "eager" : "lazy"}
                className="object-contain p-2"
              />
            </div>
          </div>
        </Link>
      ))}

      {n > 1 && (
        <div className="absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5 sm:bottom-3.5">
          {slides.map((s, k) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setI(k)}
              aria-label={t.slideN(k + 1)}
              aria-current={k === i}
              className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-brand" : "w-1.5 bg-slate-400/50 hover:bg-slate-500"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
