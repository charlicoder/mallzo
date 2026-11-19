import Image from "next/image";
import Link from "next/link";
import SearchForm from "./SearchForm";
import { dict, type Locale } from "@/lib/i18n";
import { MENU } from "@/lib/taxonomy";

export type HeroProduct = { slug: string; title: string; image: string };

// Landing hero: brand promise + search + category shortcuts, with a collage of featured products.
export default function BrandHero({ lang, products }: { lang: Locale; products: HeroProduct[] }) {
  const t = dict[lang];
  const collage = products.slice(0, 4);
  const tilt = ["-rotate-3", "rotate-2", "rotate-3", "-rotate-2"];

  return (
    <>
      <section
        aria-label={t.welcomeAria}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff1f2] via-[#ffe0e4] to-[#ffc6cf] px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14"
      >
        <div className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 start-1/3 h-64 w-64 rounded-full bg-rose-300/25 blur-3xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold text-brand shadow-sm ring-1 ring-black/5 sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> {t.heroEyebrow}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">{t.heroSub}</p>

            <div className="mt-6 max-w-xl">
              <SearchForm lang={lang} withButton />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {MENU.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-black/5 transition hover:bg-brand hover:text-white"
                >
                  {t.categories[c.slug]}
                </Link>
              ))}
            </div>
          </div>

          {collage.length > 0 && (
            <div className="grid grid-cols-4 gap-2.5 lg:grid-cols-2 lg:gap-4" aria-hidden={false}>
              {collage.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  aria-label={p.title}
                  className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 transition duration-300 hover:z-10 hover:rotate-0 hover:scale-105 lg:rounded-3xl ${tilt[i]} ${i % 2 === 1 ? "lg:translate-y-6" : ""}`}
                >
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22vw, 25vw"
                    priority={i < 2}
                    loading="eager"
                    className="object-contain p-2"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 lg:grid-cols-4">
        {t.trust.map((x) => (
          <li key={x.title} className="flex items-start gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-slate-200 sm:p-4">
            <span className="text-2xl" aria-hidden>{x.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">{x.title}</p>
              <p className="text-xs text-slate-500 sm:text-[13px]">{x.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
