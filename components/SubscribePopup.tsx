"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";
import { COUNTRIES, flag } from "@/lib/countries";
import { dict, type Locale } from "@/lib/i18n";

// Switched off for now. Set to true to turn the popup back on (no other change needed).
const ENABLED = false;
const SHOW_AFTER_MS = 20_000;
const SNOOZE_MS = 7 * 24 * 3600 * 1000; // after a close, don't ask again for a week
const KEY = "mz_subscribe";

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const write = (v: string) => {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
};


type Status = "idle" | "sending" | "done" | "invalid" | "error";

// Appears once, 20 seconds after the visitor lands. Collects only a phone number with country code.
export default function SubscribePopup({ lang }: { lang: Locale }) {
  const t = dict[lang];
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("KW");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ENABLED) return;
    const v = read();
    if (v === "done" || (v && Date.now() - Number(v) < SNOOZE_MS)) return;
    const id = setTimeout(() => {
      setOpen(true);
    }, SHOW_AFTER_MS);
    return () => clearTimeout(id);
  }, [lang]);

  const close = () => {
    setOpen(false);
    if (status !== "done") write(String(Date.now()));
  };

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      write(String(Date.now()));
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 5 || digits.length > 14) return setStatus("invalid");
    const dial = COUNTRIES.find((c) => c[0] === country)![1];
    setStatus("sending");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country_code: `+${dial}`, phone: digits, country, language: lang, source: "popup" }),
      });
      if (r.status === 400) return setStatus("invalid");
      if (!r.ok) return setStatus("error");
      write("done");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div role="dialog" aria-modal="true" aria-labelledby="sub-title" className="relative w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="h-1.5 bg-gradient-to-r from-[#ff8a4c] to-[#f2481b]" />
        <button type="button" onClick={close} aria-label={t.subClose} className="absolute end-3 top-4 grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <div className="px-6 pb-6 pt-6 sm:px-8">
          <LogoMark size={48} />
          {status === "done" ? (
            <div className="py-6" role="status">
              <h2 id="sub-title" className="text-2xl font-bold text-slate-900">{t.subThanks}</h2>
              <p className="mt-2 text-slate-600">{t.subThanksBody}</p>
              <button type="button" onClick={close} className="mt-6 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700">{t.subClose}</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 id="sub-title" className="mt-4 text-2xl font-bold leading-tight text-slate-900">{t.subTitle}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{t.subBody}</p>

              <label htmlFor="sub-phone" className="mt-5 block text-sm font-medium text-slate-700">{t.subPhone}</label>
              <div className="mt-1.5 flex gap-2" dir="ltr">
                <select aria-label={t.subCountry} value={country} onChange={(e) => setCountry(e.target.value)} className="w-[7.5rem] shrink-0 rounded-xl border border-slate-300 bg-white px-2 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30">
                  {COUNTRIES.map(([iso, dial, name]) => (
                    <option key={iso} value={iso} title={name}>{flag(iso)} +{dial} {iso}</option>
                  ))}
                </select>
                <input ref={input} id="sub-phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="501234567" value={phone} onChange={(e) => { setPhone(e.target.value); setStatus("idle"); }} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-3 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30" aria-invalid={status === "invalid"} />
              </div>
              <p className="mt-2 min-h-5 text-sm text-red-600" role="alert">{status === "invalid" ? t.subInvalid : status === "error" ? t.subError : ""}</p>

              <button type="submit" disabled={status === "sending"} className="mt-2 w-full rounded-xl bg-brand py-3 font-semibold text-white shadow-lg shadow-brand/30 transition hover:brightness-95 disabled:opacity-60">
                {status === "sending" ? t.subSending : t.subButton}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">{t.subNote}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
