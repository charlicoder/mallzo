import { BarSkeleton, GridSkeleton } from "@/components/Skeletons";

// Shown instantly while a page is being rendered on the server.
export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
      <BarSkeleton />
      <GridSkeleton />
    </section>
  );
}
