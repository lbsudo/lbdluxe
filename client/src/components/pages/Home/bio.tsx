import { Card } from "@/components/ui/card";
import { useTypewriter } from "@/hooks/use-typewriter";

const STATIC_WORDS = [
  "Full Stack Developer",
  "React Enthusiast",
  "Open Source Contributor",
];
const STATIC_DESCRIPTION =
  "I build modern web applications with a focus on performance, accessibility, and developer experience.";
const STATIC_NAME = "Lawrence Brown";

export const Bio = () => {
  const typewriter = useTypewriter(STATIC_WORDS);

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center text-center">
        <Card
          className="
            w-80 h-80 flex flex-col items-center justify-center gap-4
            border border-neutral-500/40 rounded-2xl
            backdrop-blur-lg bg-background/5 dark:bg-background/40
            shadow-xl p-0
          "
        >
          <div className="text-muted-foreground text-sm">
            No profile image
          </div>
        </Card>
      </div>

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
        <h1 className="text-4xl font-bold tracking-tight text-foreground drop-shadow-sm">
          {STATIC_NAME}
        </h1>

        {STATIC_WORDS.length > 0 && (
          <p className="text-2xl font-medium text-[#8F4BD2] h-7 tracking-wide select-none">
            {typewriter}
          </p>
        )}

        {STATIC_DESCRIPTION && (
          <p className="text-xl mt-2 leading-relaxed text-foreground/70 max-w-sm">
            {STATIC_DESCRIPTION}
          </p>
        )}
      </div>
    </>
  );
};
