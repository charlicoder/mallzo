import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200/70 bg-[#f7f4f4]/85 backdrop-blur-lg sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Mallzo home">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-base font-bold text-white">M</span>
          <span className="text-xl font-bold tracking-tight text-slate-900">mallzo</span>
        </Link>
      </div>
    </header>
  );
}
