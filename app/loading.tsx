import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 px-6 py-12">
          <Skeleton className="mb-4 h-12 w-3/4" />
          <Skeleton className="mb-6 h-20 w-1/2" />
          <Skeleton className="h-10 w-40" />
        </div>
      </section>

      <section className="mb-12">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid gap-8 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="mb-4 h-6 w-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}