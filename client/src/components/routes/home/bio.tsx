import { useEffect, useState } from "react";

function useTypewriter(
  words: string[],
  speed = 90,
  deleteSpeed = 40,
  pause = 1200,
) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Typing + deleting logic
  useEffect(() => {
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
      () => {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      },
      deleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  return `${words[index].substring(0, subIndex)}${blink ? "|" : ""}`;
}

export const Bio = () => {
  const roles = [
    "Systems Engineer",
    "Web/Mobile Developer",
    "AppSec Engineer",
    "BioMaxer",
  ];

  const typewriter = useTypewriter(roles);
  return (
    <div
      className="
                    mt-6 px-6 py-6 rounded-2xl backdrop-blur-xl
                    bg-white/10 dark:bg-neutral-900/40
                    border border-white/20 dark:border-neutral-500/40
                    shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]
                    flex flex-col items-center gap-3 text-center
                "
    >
      {/* NAME */}
      <h1 className="text-4xl font-bold tracking-tight text-foreground drop-shadow-sm">
        Lawrence Brown
      </h1>

      {/* TYPEWRITER */}
      <p className="text-2xl font-medium text-[#8F4BD2] dark:text-[#8F4BD2] h-7 tracking-wide select-none">
        {typewriter}
      </p>

      {/* DESCRIPTION */}
      <p className="text-xl mt-2 leading-relaxed text-foreground/70 dark:text-foreground/60 max-w-sm">
        I'm a self-taught engineer based in California, focused on developing
        quality software products ,the system engineering that connects the
        together, the security that keeps them up and running, and being
        versatile in software and life.
      </p>
    </div>
  );
};
