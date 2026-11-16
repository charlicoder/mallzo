import Link from "next/link";
import { dict } from "@/lib/i18n";

// not-found has no access to route params, so show both languages.
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="text-6xl">🛍️</div>
      <h1 className="mt-4 text-2xl font-extrabold">{dict.en.notFoundTitle}</h1>
      <p className="mt-2 text-slate-500">{dict.en.notFoundText}</p>
      <h2 dir="rtl" lang="ar" className="mt-6 text-xl font-extrabold">{dict.ar.notFoundTitle}</h2>
      <p dir="rtl" lang="ar" className="mt-1 text-slate-500">{dict.ar.notFoundText}</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-bold text-white">
        {dict.en.keepShopping} · {dict.ar.keepShopping}
      </Link>
    </div>
  );
}
