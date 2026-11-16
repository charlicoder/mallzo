"use client";

import { useEffect, useRef, useState } from "react";
import { dict, type Locale } from "@/lib/i18n";

type Props = { videos: string[]; start: number; onClose: () => void; buyHref: string; site: string; lang: Locale };

/**
 * Full-screen video popup. Videos are stacked in a vertical scroll-snap "reel":
 * swipe up/down on mobile (or use the arrows / keyboard on desktop) to move between them.
 * The video in view autoplays; the others pause.
 */
export default function VideoModal({ videos, start, onClose, buyHref, site, lang }: Props) {
  const t = dict[lang];
  const list = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(start);

  const goTo = (i: number) => {
    const el = list.current;
    if (el && i >= 0 && i < videos.length) el.scrollTo({ top: i * el.clientHeight, behavior: "smooth" });
  };

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    el.scrollTo({ top: start * el.clientHeight });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            v.play().catch(() => {});
            setCur(Number(v.dataset.idx));
          } else {
            v.pause();
          }
        }
      },
      { root: el, threshold: [0, 0.6, 1] },
    );
    el.querySelectorAll("video").forEach((v) => io.observe(v));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") el.scrollBy({ top: el.clientHeight, behavior: "smooth" });
      if (e.key === "ArrowUp") el.scrollBy({ top: -el.clientHeight, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [start, onClose]);

  const multi = videos.length > 1;

  return (
    <div role="dialog" aria-modal="true" aria-label={t.videosAria} className="fixed inset-0 z-50 h-dvh bg-black">
      <div ref={list} className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto overscroll-contain">
        {videos.map((src, i) => (
          <div key={src} className="flex h-full snap-start snap-always items-center justify-center">
            <video
              data-idx={i}
              src={src}
              controls
              loop
              playsInline
              preload={Math.abs(i - start) <= 1 ? "auto" : "metadata"}
              controlsList="nodownload"
              className="max-h-full w-full max-w-3xl bg-black object-contain"
            />
          </div>
        ))}
      </div>

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="pointer-events-auto rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          {multi ? t.videoOf(cur + 1, videos.length) : t.videoLabel}
        </span>
        <a
          href={buyHref}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="pointer-events-auto ms-auto rounded-full bg-brand px-4 py-2 text-xs font-extrabold text-white shadow-lg"
        >
          {t.buyOn(site || t.store)} <span className="inline-block rtl:rotate-180">→</span>
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeVideo}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      {multi && (
        <>
          {/* position dots (reel style) */}
          <div className="pointer-events-none absolute end-2 top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
            {videos.map((_, i) => (
              <span key={i} className={`w-1.5 rounded-full transition-all ${i === cur ? "h-6 bg-white" : "h-1.5 bg-white/40"}`} />
            ))}
          </div>
          {/* desktop prev/next */}
          <div className="absolute end-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
            <NavBtn dir="up" label={t.prevVideo} disabled={cur === 0} onClick={() => goTo(cur - 1)} />
            <NavBtn dir="down" label={t.nextVideo} disabled={cur === videos.length - 1} onClick={() => goTo(cur + 1)} />
          </div>
          {cur < videos.length - 1 && (
            <p className="pointer-events-none absolute inset-x-0 bottom-2 animate-bounce text-center text-xs font-semibold text-white/80 sm:hidden">
              {t.swipeUp}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function NavBtn({ dir, label, disabled, onClick }: { dir: "up" | "down"; label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30 disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === "up" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
      </svg>
    </button>
  );
}
