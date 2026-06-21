import { Skeleton } from "@/components/ui/skeleton";

export const PanelBodySkeleton = () => {
  return (
    <div className="relative z-10 mx-4 flex w-full flex-col items-center justify-center bg-black px-4 pb-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="relative mt-2 mb-3 flex w-full items-center justify-center rounded-full bg-[#121212] p-2"
        >
          <div className="flex min-w-[320px] flex-row items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};