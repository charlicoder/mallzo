import Logo from "./Logo";
import { dict, type Locale } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Locale }) {
  const t = dict[lang];
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
        <Logo className="justify-center" />
        <p className="mx-auto mt-2 max-w-2xl">{t.footer}</p>
        <p className="mt-4 text-xs text-slate-400">© {new Date().getFullYear()} Mallzo. {t.rights}</p>
      </div>
    </footer>
  );
}
