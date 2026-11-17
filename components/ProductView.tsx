"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { ProductDetail } from "@/lib/api";
import VideoModal from "./VideoModal";
import { dict, type Locale } from "@/lib/i18n";

export default function ProductView({ product, lang }: { product: ProductDetail; lang: Locale }) {
  const t = dict[lang];
  const dir = lang === "ar" ? -1 : 1; // scrollLeft is negative in RTL
  const { variants } = product;
  const [vi, setVi] = useState(Math.max(0, variants.findIndex((v) => !v.unavailable)));
  const [ii, setIi] = useState(0);
  const [videoAt, setVideoAt] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closeVideo = useCallback(() => setVideoAt(null), []);

  const variant = variants[vi];
  const images = variant?.images ?? [];
  const videos = Array.from(new Set([...(variant?.videos ?? []), ...product.videos]));
  const hasVariantChoice = variants.length > 1;

  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: dir * i * el.clientWidth, behavior: "smooth" });
    setIi(i);
  };
  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    if (i !== ii) setIi(i);
  };
  const pick = (i: number) => {
    setVi(i);
    setIi(0);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
      {/* ───────── Gallery ───────── */}
      <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:h-fit">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row-reverse">
          {/* Swipeable main image (native scroll-snap: swipe on phones, arrows on desktop) */}
          <div className="relative min-w-0 flex-1">
            <div
              key={variant?.id}
              ref={scroller}
              onScroll={onScroll}
              className="no-scrollbar flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl bg-white ring-1 ring-slate-200"
            >
              {images.map((img, i) => (
                <div key={img.url} className="relative h-full w-full shrink-0 snap-center">
                  <Image
                    src={img.url}
                    alt={`${product.title} — ${variant.label} (${i + 1})`}
                    fill
                    priority={i === 0}
                    sizes="(min-width:1024px) 45vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
              ))}
            </div>

            {images.length > 1 && (
              <>
                <span dir="ltr" className="absolute end-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {ii + 1} / {images.length}
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden">
                  {images.slice(0, 10).map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full bg-white shadow transition-all ${i === ii ? "w-5" : "w-1.5 opacity-60"}`} />
                  ))}
                </div>
                <div className="hidden lg:block">
                  <Arrow dir="prev" label={t.prevImage} onClick={() => goTo((ii - 1 + images.length) % images.length)} />
                  <Arrow dir="next" label={t.nextImage} onClick={() => goTo((ii + 1) % images.length)} />
                </div>
              </>
            )}

            {videos.length > 0 && (
              <button
                type="button"
                onClick={() => setVideoAt(0)}
                className="absolute bottom-3 start-3 flex items-center gap-2 rounded-full bg-white/95 py-1.5 ps-1.5 pe-4 text-xs font-bold text-slate-900 shadow-lg backdrop-blur transition hover:scale-105 active:scale-95"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white">
                  <PlayIcon className="h-3.5 w-3.5" />
                </span>
                {videos.length > 1 ? t.watchVideos(videos.length) : t.watchVideo}
              </button>
            )}
          </div>

          {/* Thumbnails: all images, then a video tile at the end */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto lg:max-h-[640px] lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-y-auto" role="list" aria-label={t.mediaAria}>
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t.showImage(i + 1)}
                aria-current={i === ii}
                className={`relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-xl bg-white transition lg:w-full ${
                  i === ii ? "ring-2 ring-brand ring-offset-2 ring-offset-[#f7f4f4]" : "opacity-70 ring-1 ring-slate-200 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="80px" className="object-contain p-1" />
              </button>
            ))}
            {videos.length > 0 && (
              <VideoThumb src={videos[0]} label={t.videoLabel} play={t.playVideo(t.videoLabel)} onClick={() => setVideoAt(0)} className="w-16 shrink-0 lg:w-full" />
            )}
          </div>
        </div>

        {/* Video thumbnail list under the main image */}
        {videos.length > 0 && (
          <section aria-label={t.videosAria}>
            <h2 className="mb-2 text-sm font-bold">{t.videos(videos.length)}</h2>
            <div className="no-scrollbar flex gap-3 overflow-x-auto">
              {videos.map((src, i) => (
                <VideoThumb key={src} src={src} label={t.videoN(i + 1)} play={t.playVideo(t.videoN(i + 1))} onClick={() => setVideoAt(i)} className="w-28 shrink-0 sm:w-32" wide />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ───────── Info ───────── */}
      <div className="pb-24 lg:pb-0">
        {product.brand && <p className="text-xs font-bold uppercase tracking-widest text-brand">{product.brand}</p>}
        <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{product.title}</h1>
        {product.category_path && <p className="mt-2 text-xs text-slate-500">{product.category_path.replaceAll(">", "›")}</p>}

        {variant?.price && (
          <p className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-brand">{variant.price}</span>
            {variant.unavailable && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{t.unavailable}</span>
            )}
          </p>
        )}

        {hasVariantChoice || variants[0]?.swatch_image ? (
          <section className="mt-7" aria-label={t.colorsAria}>
            <h2 className="text-sm font-bold">
              {variants.some((v) => v.color) ? t.color : t.style}: <span className="font-medium text-slate-600">{variant?.label}</span>
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => pick(i)}
                  title={v.label}
                  aria-label={v.label}
                  aria-pressed={i === vi}
                  className={`relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 transition ${
                    i === vi ? "ring-2 ring-brand ring-offset-2 ring-offset-[#f7f4f4]" : "ring-1 ring-slate-200 hover:ring-brand"
                  } ${v.unavailable ? "opacity-50" : ""}`}
                >
                  {v.swatch_image || v.images[0]?.url ? (
                    <Image src={v.swatch_image || v.images[0].url} alt="" fill sizes="64px" className="object-contain p-0.5" />
                  ) : (
                    <span className="grid h-full place-items-center px-1 text-[10px] font-semibold">{v.label}</span>
                  )}
                  {v.unavailable && <span className="absolute inset-x-0 top-1/2 h-px -rotate-45 bg-slate-500" />}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {product.sizes.length > 0 && (
          <section className="mt-6" aria-label={t.sizesAria}>
            <h2 className="text-sm font-bold">{t.sizes}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <span key={s} className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{s}</span>
              ))}
            </div>
          </section>
        )}

        <BuyButton href={product.affiliate_link} label={t.buyNow(product.affiliate_site || t.store)} className="mt-8 hidden lg:flex" />
        <p className="mt-3 hidden text-center text-xs text-slate-500 lg:block">
          {t.redirectNote(product.affiliate_site || t.theStore)}
        </p>

        <ul className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-slate-600">
          {[["🛡️", t.trusted], ["🚚", t.delivery], ["↩️", t.returns]].map(([e, t]) => (
            <li key={t} className="rounded-2xl bg-white py-3 ring-1 ring-slate-200">
              <div className="text-xl">{e}</div>{t}
            </li>
          ))}
        </ul>

        {product.subtitle && (
          <section className="mt-8">
            <h2 className="text-sm font-bold">{t.about}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{product.subtitle}</p>
          </section>
        )}

        {product.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {product.tags.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">#{t}</span>
            ))}
          </div>
        )}
        <p className="mt-8 text-xs text-slate-400">{t.affiliate}</p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-[#f7f4f4]/90 p-3 backdrop-blur-lg lg:hidden">
        <BuyButton href={product.affiliate_link} label={t.buyNow(product.affiliate_site || t.store)} className="w-full py-3.5" />
      </div>

      {videoAt !== null && (
        <VideoModal
          videos={videos}
          start={videoAt}
          onClose={closeVideo}
          buyHref={product.affiliate_link}
          site={product.affiliate_site}
          lang={lang}
        />
      )}
    </div>
  );
}

function VideoThumb({ src, label, play, onClick, className = "", wide = false }: { src: string; label: string; play: string; onClick: () => void; className?: string; wide?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={play}
      className={`group relative overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-200 ${wide ? "aspect-video" : "aspect-[4/5]"} ${className}`}
    >
      {/* #t=0.5 makes the browser paint a frame as the poster */}
      <video src={`${src}#t=0.5`} muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/10">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-brand shadow-md transition group-hover:scale-110">
          <PlayIcon className="h-4 w-4" />
        </span>
      </span>
      <span className="absolute bottom-1 start-1.5 text-[10px] font-bold text-white drop-shadow">{label}</span>
    </button>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function BuyButton({ href, label, className = "" }: { href: string; label: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={`flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-orange-300/50 transition hover:scale-[1.02] hover:shadow-xl active:scale-95 ${className}`}
    >
      {label}
      <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}

function Arrow({ dir, label, onClick }: { dir: "prev" | "next"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-slate-800 shadow-md backdrop-blur transition hover:bg-white ${dir === "prev" ? "start-3" : "end-3"}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === "prev" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
      </svg>
    </button>
  );
}
