import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Link } from "@tanstack/react-router";
import proPic from "../../../../assets/proPic-500x500.png";
import proPicWebp from "../../../../assets/proPic-avatar.webp";
import proPicAvif from "../../../../assets/proPic-avatar.avif";

export const ProfileBar = () => {
  return (
    <>
      <div
        className={`fixed top-0 z-90 left-1/2 -translate-x-1/2 flex h-14 w-[calc(100%-2rem)] max-w-[352px] flex-row items-center justify-between px-4 transition-opacity duration-200 md:max-w-[416px]`}
        style={{
          backgroundColor: `rgba(18,18,18,1)`,
        }} // Apply calculated opacity
      >
        <div className={"flex items-center justify-center"}>
          <picture>
            <source srcSet={proPicAvif} type="image/avif" />
            <source srcSet={proPicWebp} type="image/webp" />
            <img
              src={proPic}
              alt={"user bar"}
              height={36}
              width={36}
              decoding="async"
              fetchPriority="high"
              className={"mx-[2%] my-3 h-9 w-9 rounded-full"}
            />
          </picture>
          <p className={"text-xl font-bold whitespace-nowrap"}>LB DLUXE</p>
        </div>
        <Link to={"/"}>
          <HoverBorderGradient
            as="button"
            className={"text-sm flex items-center justify-center gap-2"}
          >
            Main Site
          </HoverBorderGradient>
        </Link>
      </div>
    </>
  );
};
