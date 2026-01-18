import { Skeleton } from "@/components/ui/skeleton";

/**
 * Simple skeleton placeholder that mimics the layout of a WorkCard.
 * Uses the neutral "bg-muted" color from the existing Skeleton component.
 */
export const WorkCardSkeleton = () => (
  <section className="w-full">
    <div className="relative border rounded-lg pb-6 flex flex-col h-full bg-card">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-t-2xl mb-3" />
      <div className="px-4 flex flex-col flex-1">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        {/* Description – two lines */}
        <div className="flex-1">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-3" />
        </div>
        {/* Action button placeholders */}
        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      </div>
    </div>
  </section>
);
