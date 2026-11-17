import Link from "next/link";
import LangSwitch from "./LangSwitch";
import NavMenu from "./NavMenu";
import { dict, type Locale } from "@/lib/i18n";

export default function Header({ lang }: { lang: Locale }) {
  return (
    <header className="border-b border-slate-200/70 bg-[#f7f4f4]/85 backdrop-blur-lg sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={dict[lang].homeAria}>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-base font-bold text-white">M</span>
          <span className="text-xl font-bold tracking-tight text-slate-900" dir="ltr">mallzo</span>
        </Link>
        <div className="hidden min-w-0 lg:block">
          <NavMenu lang={lang} />
        </div>
        <div className="ms-auto flex justify-end lg:ms-0">
          <LangSwitch lang={lang} />
        </div>
      </div>
      {/* Phones/tablets: the menu gets its own scrollable row. */}
      <div className="mx-auto max-w-7xl px-4 pb-2.5 sm:px-8 lg:hidden">
        <NavMenu lang={lang} />
      </div>
    </header>
  );
}
