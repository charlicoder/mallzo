export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-slate-500 sm:px-6">
        <p className="text-lg font-extrabold tracking-tight text-slate-800">
          mall<span className="text-brand-gradient">zo</span>
        </p>
        <p className="mx-auto mt-2 max-w-2xl">
          Mallzo is a participant in affiliate programs. When you buy through links on our site we may earn a
          commission at no extra cost to you. Prices and availability are set by the retailer and may change.
        </p>
        <p className="mt-4 text-xs text-slate-400">© {new Date().getFullYear()} Mallzo. All rights reserved.</p>
      </div>
    </footer>
  );
}
