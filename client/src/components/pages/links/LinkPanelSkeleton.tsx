import { Skeleton } from "@/components/ui/skeleton";

export const LinkPanelSkeleton = () => {
  return (
    <div
      className={
        "relative z-2 flex max-w-sm flex-col items-center justify-center rounded-3xl md:mt-8 md:max-w-md"
      }
    >
      <div className="justify-center fixed top-0 z-1 mx-4 flex w-fit max-w-sm md:top-8 md:max-w-md">
        <Skeleton className="h-[500px] w-[500px] rounded-none object-cover md:rounded-2xl" />
      </div>
      <div className="relative bottom-0 z-10 flex w-full max-w-sm flex-col items-center justify-center bg-linear-to-b from-transparent to-black px-4 pt-[60%] md:pt-[60%]">
        <Skeleton className="mb-2 h-10 w-48 rounded-lg" />
        <Skeleton className="mb-2 h-6 w-24 rounded-lg" />
        <Skeleton className="h-16 w-full max-w-sm rounded-lg" />
      </div>
      <div className="relative z-10 mx-4 flex w-full max-w-sm flex-col items-center justify-center bg-black px-4 pb-4">
        <Skeleton className="mb-2 h-48 w-full rounded-2xl" />
        <Skeleton className="mb-2 h-48 w-full rounded-2xl" />
        <div className="flex w-full items-center justify-center gap-2">
          <Skeleton className="h-24 w-1/2 rounded-xl" />
          <Skeleton className="h-24 w-1/2 rounded-xl" />
        </div>
      </div>
    </div>
  );
};