// Shown instantly while a page (e.g. the other language) is rendering.
export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8" aria-busy="true">
      <div className="h-14 animate-pulse rounded-full bg-slate-100" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 pt-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 sm:pt-10 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] animate-pulse rounded-[1.75rem] bg-slate-200/60" />
            <div className="mt-3.5 h-4 w-4/5 animate-pulse rounded bg-slate-200/60" />
            <div className="mt-2 h-4 w-3/5 animate-pulse rounded bg-slate-200/60" />
          </div>
        ))}
      </div>
    </section>
  );
}
