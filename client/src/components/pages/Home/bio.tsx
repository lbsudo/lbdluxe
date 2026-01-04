import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useGetProfile } from "@/hooks/server/supabase/useGetProfile.ts";

/* ----------------------------------------
   Typewriter Hook (unchanged)
---------------------------------------- */

function useTypewriter(
  words: Array<string>,
  speed = 90,
  deleteSpeed = 40,
  pause = 1200,
) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (words.length === 0) return;

    const current = words[index];

    if (!deleting && subIndex === current.length) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, words, pause, speed, deleteSpeed]);

  return words.length > 0
    ? `${words[index].substring(0, subIndex)}${blink ? "|" : ""}`
    : "";
}

/* ----------------------------------------
   Bio Component
---------------------------------------- */

export const Bio = () => {
  const { data: profile, isLoading, error } = useGetProfile();

  // Defensive fallbacks
  const words = profile?.words ?? [];
  const description = profile?.description ?? "";
  const profileImage = profile?.profile_image_url ?? "";

  const typewriter = useTypewriter(words);

  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground">Loading profile…</p>
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
            backdrop-blur-lg bg-white/5 dark:bg-neutral-900/40
            shadow-xl
          "
        >
          {profileImage ? (
            <img
              alt="Profile photo"
              src={profileImage}
              className="w-76 h-76 object-cover rounded-xl filter grayscale"
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
          mt-6 px-6 py-6 rounded-2xl backdrop-blur-xl
          bg-white/10 dark:bg-neutral-900/40
          border border-white/20 dark:border-neutral-500/40
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
