import Link from "next/link";
import LangSwitch from "./LangSwitch";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import NavMenu from "./NavMenu";
import { dict, type Locale } from "@/lib/i18n";

export default function Header({ lang }: { lang: Locale }) {
  return (
    <header className="border-b border-slate-200/70 bg-[#f7f4f4]/85 backdrop-blur-lg sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <div className="flex shrink-0 items-center gap-1">
          <MobileMenu lang={lang} />
          <Link href="/" className="flex shrink-0 items-center" aria-label={dict[lang].homeAria}>
            <Logo />
          </Link>
        </div>
        <div className="hidden min-w-0 lg:block">
          <NavMenu lang={lang} />
        </div>
        <div className="ms-auto flex justify-end lg:ms-0">
          <LangSwitch lang={lang} />
        </div>
      </div>
    </header>
  );
}
