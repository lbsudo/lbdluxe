import { MotionUp } from "@/components/global/motions/motion-up";
import { VideoPlatformLinks } from "@/components/video-platform-links";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/links/yt-links/")({
  component: RouteComponent,
});

interface LinkItem {
  linkUrl: string;
  title: string;
  siIconName: "SiRumble" | "SiYoutube";
  hex?: "#FF0000" | "#3E8E41" | undefined;
}

const youtubelinks: LinkItem[] = [
  {
    linkUrl: "https://youtube.com/@lbdluxe",
    title: "LB Dluxe (Main Channel)",
    siIconName: "SiYoutube",
    hex: "#FF0000",
  },
  {
    linkUrl: "https://youtube.com/@lbdluxedigital",
    title: "LB Dluxe Digital (Tech & Software)",
    siIconName: "SiYoutube",
    hex: "#FF0000",
  },
  {
    linkUrl: "https://youtube.com/@thefadedphilosopher",
    title: "The Faded Philosopher (Podcast)",
    siIconName: "SiYoutube",
    hex: "#FF0000",
  },
  {
    linkUrl: "https://youtube.com/@LBDluxebeats",
    title: "LB Dluxe Beats (Music Production)",
    siIconName: "SiYoutube",
    hex: "#FF0000",
  },
  {
    linkUrl: "https://youtube.com/@ascendeddluxe",
    title: "Ascended Dluxe (Polymathy)",
    siIconName: "SiYoutube",
    hex: "#FF0000",
  },
];

function RouteComponent() {
  return (
    <>
      <section
        className={"flex flex-col items-center justify-center overflow-hidden"}
      >
        <MotionUp>
          <VideoPlatformLinks links={youtubelinks} />
        </MotionUp>
      </section>
    </>
  );
}
