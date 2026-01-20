import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Link } from "@tanstack/react-router";
import proPic from "../../../../assets/proPic-500x500.png";

export const ProfileBar = () => {
  return (
    <>
      <div
        className={`fixed top-0 z-90 flex h-14 w-full max-w-sm flex-row items-center justify-between px-4 transition-opacity duration-200 md:max-w-md`}
        style={{
          backgroundColor: `rgba(18,18,18,1)`,
        }} // Apply calculated opacity
      >
        <div className={"flex items-center justify-center"}>
          <img
            src={proPic}
            alt={"user bar"}
            height={80}
            width={80}
            className={"mx-[2%] my-3 h-9 w-9 rounded-full"}
          />
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
