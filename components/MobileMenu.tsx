"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Logo from "./Logo";
import { dict, type Locale } from "@/lib/i18n";
import { MENU } from "@/lib/taxonomy";

// Phones and tablets: a bar (hamburger) button beside the logo opens a slide-in menu from the start edge
// (left in English, right in Arabic). Rendered in a portal because the sticky header's blur would
// otherwise trap a fixed panel inside the header.
export default function MobileMenu({ lang }: { lang: Locale }) {
  const t = dict[lang];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [shownFor, setShownFor] = useState(pathname);

  // Close after navigating (state adjusted during render, not in an effect).
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.openMenu}
        aria-expanded={open}
        className="-ms-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-800 transition hover:bg-slate-100 lg:hidden"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="drawer-backdrop absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <nav
              role="dialog"
              aria-modal="true"
              aria-label={t.menuAria}
              className="drawer-panel absolute inset-y-0 start-0 flex w-[82%] max-w-xs flex-col overflow-y-auto bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <Link href="/" aria-label={t.homeAria}><Logo /></Link>
                <button type="button" onClick={() => setOpen(false)} aria-label={t.closeMenu} className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
              <ul className="flex-1 space-y-1 p-3">
                {MENU.map((c) => {
                  const on = pathname === `/${c.slug}`;
                  return (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        aria-current={on ? "page" : undefined}
                        className={`block rounded-xl px-4 py-3 text-[15px] font-bold uppercase tracking-wide transition ${on ? "bg-brand text-white" : "text-slate-800 hover:bg-slate-100"}`}
                      >
                        {t.categories[c.slug]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
