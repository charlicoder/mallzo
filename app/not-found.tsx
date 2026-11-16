import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="text-6xl">🛍️</div>
      <h1 className="mt-4 text-2xl font-extrabold">We couldn&apos;t find that product</h1>
      <p className="mt-2 text-slate-500">It may have been removed or is no longer available.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-brand-gradient px-6 py-3 text-sm font-bold text-white">Keep shopping</Link>
    </div>
  );
}
