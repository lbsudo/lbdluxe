import { useCMSLinksProfile } from "@/hooks/server/cms/GET/useCMSLinksProfile"
import SocialLinks from "./SocialLinks/SocialLinks";
import proPic from "../../../../assets/proPic-500x500.png";
import checkmark from "../../../../assets/checkmark.svg";

export const ProfileDetails = () => {
  const { data: profile } = useCMSLinksProfile()

  return (
    <>
      
      <div className="justify-cen ter fixed top-0 z-1 flex w-fit max-w-sm md:top-8 md:max-w-md">
        <img
          src={proPic}
          alt={"Profile Picture"}
          height={550}
          width={556}
          className={"relative rounded-none object-cover md:rounded-2xl"}
        />
      </div>
      <div
        className={
          "relative bottom-0 z-10 flex w-full flex-col items-center justify-center bg-linear-to-b from-transparent to-black px-4 pt-[60%] md:pt-[60%]"
        }
      >
        <h1 className={"flex items-center justify-center gap-1 text-4xl"}>
          Lawrence Brown{" "}
          <img src={checkmark} alt={"Checkmark"} width={21} height={21} />
        </h1>
        <h6 className={"flex items-center justify-center text-lg"}>@lbdluxe</h6>
        {profile?.bio && (
          <p className={"mt-2 text-center text-lg font-medium text-white max-w-sm whitespace-pre-line"}>{profile.bio}</p>
        )}
        <SocialLinks />
      </div>
    </>
  );
};
