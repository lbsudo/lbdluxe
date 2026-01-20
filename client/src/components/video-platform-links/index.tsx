import { Link } from "@tanstack/react-router";
import React from "react";
import { RxCaretLeft } from "react-icons/rx";
import { NoThumbLink } from "../pages/links/profile/SocialLinks/no-thumb-link";

interface LinkItem {
  linkUrl: string;
  title: string;
  siIconName: "SiRumble" | "SiYoutube";
  hex?: "#FF0000" | "#3E8E41" | undefined;
}

// Define props interface for VideoPlatformLinks component
interface VideoPlatformLinksProps {
  links: LinkItem[];
}

export const VideoPlatformLinks: React.FC<VideoPlatformLinksProps> = ({
  links,
}) => {
  return (
    <>
      <div
        className={
          "relative flex h-full flex-col items-center justify-center overflow-y-hidden bg-black sm:w-screen md:max-w-[556px]"
        }
      >
        <Link className={"w-full"} to={"/links"}>
          <div
            className={`sticky top-0 z-50 flex h-14 w-full flex-row items-center bg-[#121212]`} // Apply calculated opacity
          >
            <RxCaretLeft className={"h-8 w-8"} />
            <p className={"text-xl font-bold underline"}>LB DLUXE</p>
          </div>
        </Link>
        <img
          src={`https://www.lbdluxe.com/api/media/file/lb-marble.webp`}
          alt={"Profile Picture"}
          height={550}
          width={556}
          className={"relative rounded-none object-cover md:rounded-b-2xl"}
        />
        <div
          className={
            "absolute bottom-0 z-10 flex w-full flex-col items-center justify-center space-y-2 bg-gradient-to-b from-transparent to-black px-4 pt-[65%] md:pt-[60%]"
          }
        >
          <h1 className={"flex items-center justify-center text-4xl font-bold"}>
            LB DLUXE
          </h1>
          <h6 className={"flex items-center justify-center text-xl"}>
            @lbdluxe
          </h6>
          {/* <SocialLinks />*/}
        </div>
      </div>
      <div
        className={
          "relative z-10 flex h-full w-full flex-col items-center justify-center bg-black px-4 pt-4 pb-[20vh] sm:w-screen md:max-w-[556px]"
        }
      >
        {links.map((link, index) => (
          <NoThumbLink
            key={index}
            linkUrl={link.linkUrl}
            title={link.title}
            siIconName={link.siIconName}
            hex={link.hex!}
            target={"_blank"}
          />
        ))}

        {/*<NoThumbLink*/}
        {/*  linkUrl={'https://rumble.com/c/lbdluxe'}*/}
        {/*  title={'LB Dluxe (Self Improvement)'}*/}
        {/*  siIconName={'SiRumble'}*/}
        {/*  hex={'#3E8E41'}*/}
        {/*  target={'_blank'}*/}
        {/*/>*/}
        {/*<NoThumbLink*/}
        {/*  linkUrl={'https://rumble.com/c/lbdluxedigital'}*/}
        {/*  title={'LB Dluxe Digital (Tech & Software)'}*/}
        {/*  siIconName={'SiRumble'}*/}
        {/*  hex={'#3E8E41'}*/}
        {/*  target={'_blank'}*/}
        {/*/>*/}
        {/*<NoThumbLink*/}
        {/*  linkUrl={'https://rumble.com/c/thefadedphilosopher'}*/}
        {/*  title={'The Faded Philosopher (Podcast)'}*/}
        {/*  siIconName={'SiRumble'}*/}
        {/*  hex={'#3E8E41'}*/}
        {/*  target={'_blank'}*/}
        {/*/>*/}
        {/*<NoThumbLink*/}
        {/*  linkUrl={'https://rumble.com/c/ascendeddluxe'}*/}
        {/*  title={'Ascended Dluxe (Knowledge)'}*/}
        {/*  siIconName={'SiRumble'}*/}
        {/*  hex={'#3E8E41'}*/}
        {/*  target={'_blank'}*/}
        {/*/>*/}
        {/*<NoThumbLink*/}
        {/*  linkUrl={'https://rumble.com/c/lbdluxebeats'}*/}
        {/*  title={'LB Dluxe Beats (Reactions)'}*/}
        {/*  siIconName={'SiRumble'}*/}
        {/*  hex={'#3E8E41'}*/}
        {/*  target={'_blank'}*/}
        {/*/>*/}
      </div>
    </>
  );
};
