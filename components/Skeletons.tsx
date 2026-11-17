// Placeholders shown while a streamed section loads.
export function HeroSkeleton() {
  return <div className="mb-6 h-48 animate-pulse rounded-[1.75rem] bg-slate-200/60 sm:h-60 lg:h-72" aria-hidden />;
}

export function BarSkeleton() {
  return <div className="h-14 animate-pulse rounded-full bg-slate-100" aria-hidden />;
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 pt-8 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 sm:pt-10 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] animate-pulse rounded-[1.75rem] bg-slate-200/60" />
          <div className="mt-3.5 h-4 w-4/5 animate-pulse rounded bg-slate-200/60" />
          <div className="mt-2 h-4 w-3/5 animate-pulse rounded bg-slate-200/60" />
        </div>
      ))}
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div aria-busy="true">
      <div className="mb-5 h-8 w-48 animate-pulse rounded bg-slate-200/60" />
      <div className="flex gap-4 overflow-hidden sm:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[44%] shrink-0 sm:w-[30%] lg:w-[23.5%]">
            <div className="aspect-[3/4] animate-pulse rounded-[1.75rem] bg-slate-200/60" />
            <div className="mt-3.5 h-4 w-4/5 animate-pulse rounded bg-slate-200/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
