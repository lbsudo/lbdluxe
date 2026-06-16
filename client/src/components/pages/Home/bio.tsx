import { Card } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProfile } from '@/hooks/server/supabase/profile/GET/useGetProfile';
import { useTypewriter } from "@/hooks/use-typewriter";

export const Bio = () => {
  const { data: profile, isLoading, error } = useGetProfile();

  // Defensive fallbacks
  const words = profile?.words ?? [];
  const description = profile?.description ?? "";
  const profileImage = profile?.profile_image_url ?? "";

  const typewriter = useTypewriter(words);

  if (isLoading) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card‑size image placeholder */}
      <Skeleton className="w-80 h-80 rounded-2xl" />
      {/* Name placeholder */}
      <Skeleton className="h-6 w-48" />
      {/* Description placeholders */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-56" />
      </div>
    </div>
  );
}

  if (error) {
    return <p className="text-center text-red-500">Failed to load profile</p>;
  }

  return (
    <>
      {/* Portrait */}
      <div className="w-full flex flex-col items-center justify-center text-center">
        <Card
          className="
            w-80 h-80 flex flex-col items-center justify-center gap-4
            border border-neutral-500/40 rounded-2xl
            backdrop-blur-lg bg-background/5 dark:bg-background/40
            shadow-xl p-0
          "
        >
          {profileImage ? (
            <img
              alt="Profile photo"
              src={profileImage}
              className="w-76 h-76 object-cover rounded-xl filter grayscale dark:filter-none"
            />
          ) : (
            <div className="text-muted-foreground text-sm">
              No profile image
            </div>
          )}
        </Card>
      </div>

      {/* Bio */}
      <div
        className="
          mt-6 px-6 py-6 rounded-2xl backdrop-blur-sm
          bg-background/10
          dark:bg-neutral-400/10
          border dark:border-neutral-300/25 border-neutral-800/25
          shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]
          flex flex-col items-center gap-3 text-center
        "
      >
        {/* NAME (still static unless you add it to profile later) */}
        <h1 className="text-4xl font-bold tracking-tight text-foreground drop-shadow-sm">
          Lawrence Brown
        </h1>

        {/* TYPEWRITER */}
        {words.length > 0 && (
          <p className="text-2xl font-medium text-[#8F4BD2] h-7 tracking-wide select-none">
            {typewriter}
          </p>
        )}

        {/* DESCRIPTION */}
        {description && (
          <p className="text-xl mt-2 leading-relaxed text-foreground/70 max-w-sm">
            {description}
          </p>
        )}
      </div>
    </>
  );
};
