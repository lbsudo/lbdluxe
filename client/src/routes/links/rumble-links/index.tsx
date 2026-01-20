import { MotionUp } from "@/components/global/motions/motion-up";
import { VideoPlatformLinks } from "@/components/video-platform-links";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/links/rumble-links/")({
  component: RouteComponent,
});

interface LinkItem {
  linkUrl: string;
  title: string;
  siIconName: "SiRumble" | "SiYoutube";
  hex?: "#FF0000" | "#3E8E41" | undefined;
}

const rumblelinks: LinkItem[] = [
  {
    linkUrl: "https://rumble.com/c/lbdluxe",
    title: "LB Dluxe (Main Channel)",
    siIconName: "SiRumble",
    hex: "#3E8E41",
  },
  {
    linkUrl: "https://rumble.com/c/lbdluxedigital",
    title: "LB Dluxe Digital (Tech & Software)",
    siIconName: "SiRumble",
    hex: "#3E8E41",
  },
  {
    linkUrl: "https://rumble.com/c/@thefadedphilosopher",
    title: "The Faded Philosopher (Podcast)",
    siIconName: "SiRumble",
    hex: "#3E8E41",
  },
  {
    linkUrl: "https://rumble.com/c/lbdluxebeats",
    title: "LB Dluxe Beats (Music Production)",
    siIconName: "SiRumble",
    hex: "#3E8E41",
  },
  {
    linkUrl: "https://rumble.com/c/ascendeddluxe",
    title: "Ascended Dluxe (Polymathy)",
    siIconName: "SiRumble",
    hex: "#3E8E41",
  },
];
function RouteComponent() {
  return (
    <>
      <section
        className={"flex flex-col items-center justify-center overflow-hidden"}
      >
        <MotionUp>
          <VideoPlatformLinks links={rumblelinks} />
        </MotionUp>
      </section>
    </>
  );
}
