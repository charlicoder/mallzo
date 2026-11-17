"use client";

import { useEffect, useRef, useState } from "react";
import { dict, type Locale } from "@/lib/i18n";

type Props = { lang: Locale; url: string; title: string; image?: string };

// Share menu: WhatsApp, Facebook, X, Telegram, Pinterest, e-mail, copy link, plus the device's
// native share sheet when the browser has one.
export default function ShareButton({ lang, url, title, image }: Props) {
  const t = dict[lang];
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent | TouchEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("touchstart", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("touchstart", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const text = t.shareText(title);
  const u = encodeURIComponent(url);
  const txt = encodeURIComponent(text);
  const targets = [
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, cls: "bg-[#25D366]" },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, cls: "bg-[#1877F2]" },
    { name: "X", href: `https://twitter.com/intent/tweet?url=${u}&text=${txt}`, cls: "bg-black" },
    { name: "Telegram", href: `https://t.me/share/url?url=${u}&text=${txt}`, cls: "bg-[#229ED9]" },
    { name: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${u}&description=${txt}${image ? `&media=${encodeURIComponent(image)}` : ""}`, cls: "bg-[#E60023]" },
    { name: "Email", href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n${url}`)}`, cls: "bg-slate-600" },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div ref={box} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:text-brand hover:ring-brand"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
          <path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" />
        </svg>
        {t.share}
      </button>

      {open && (
        <div role="dialog" aria-label={t.shareTitle} className="absolute end-0 z-30 mt-2 w-72 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-200">
          <p className="mb-3 text-sm font-bold">{t.shareTitle}</p>
          <div className="grid grid-cols-2 gap-2">
            {targets.map((x) => (
              <a
                key={x.name}
                href={x.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={`rounded-xl px-3 py-2.5 text-center text-sm font-bold text-white transition hover:brightness-110 ${x.cls}`}
              >
                {x.name}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={copy}
            className="mt-3 flex w-full items-center justify-between gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-start text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
          >
            <span className="truncate text-xs font-normal text-slate-500" dir="ltr">{url.replace(/^https?:\/\//, "")}</span>
            <span className="shrink-0 text-brand" aria-live="polite">{copied ? t.linkCopied : t.copyLink}</span>
          </button>
          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              type="button"
              onClick={() => navigator.share({ title, text, url }).catch(() => {})}
              className="mt-2 w-full rounded-xl py-2 text-sm font-semibold text-slate-600 hover:text-brand"
            >
              {t.shareMore}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
