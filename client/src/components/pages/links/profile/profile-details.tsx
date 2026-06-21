import { useCMSLinksProfile } from "@/hooks/server/cms/GET/useCMSLinksProfile";
import SocialLinks from "./SocialLinks/SocialLinks";
import proPic from "../../../../assets/proPic-500x500.png";
import checkmark from "../../../../assets/checkmark.svg";

interface ProfileDetailsProps {
  imagePosition?: "fixed" | "relative" | "behind-panel";
}

export const ProfileDetails = ({
  imagePosition = "fixed",
}: ProfileDetailsProps) => {
  const { data: profile } = useCMSLinksProfile();

  if (imagePosition === "relative") {
    return (
      <>
        <div className="flex w-full max-w-sm flex-col items-center">
          <div className="flex w-full justify-center">
            <img
              src={profile?.profileImage?.url ?? proPic}
              alt={"Profile Picture"}
              height={500}
              width={500}
              className={"rounded-2xl object-cover w-auto"}
              style={{
                objectPosition: profile?.profileImage?.focalPoint
                  ? `${profile.profileImage.focalPoint.x * 100}% ${profile.profileImage.focalPoint.y * 100}%`
                  : "center",
              }}
            />
          </div>
        </div>
        <div
          className={
            "relative z-10 flex w-full max-w-sm flex-col items-center justify-center bg-linear-to-b from-transparent to-black px-4 pt-4"
          }
        >
          <h1 className={"flex items-center justify-center gap-1 text-4xl"}>
            {profile?.name ?? "Lawrence Brown"}
            <img src={checkmark} alt={"Checkmark"} width={21} height={21} />
          </h1>
          <h6 className={"flex items-center justify-center text-lg"}>
            {profile?.handle ? `@${profile.handle}` : "@lbdluxe"}
          </h6>
          {profile?.bio && (
            <p
              className={
                "mt-2 text-center text-lg font-medium text-white max-w-sm whitespace-pre-line"
              }
            >
              {profile.bio}
            </p>
          )}
          <SocialLinks />
        </div>
      </>
    );
  }

  if (imagePosition === "behind-panel") {
    return (
      <div className="relative w-full max-w-sm md:max-w-md">
        <div className="absolute left-0 right-0 top-0 z-1 h-[500px]">
          <img
            src={profile?.profileImage?.url ?? proPic}
            alt={"Profile Picture"}
            height={500}
            width={500}
            className={"h-full w-full rounded-t-3xl object-cover"}
            style={{
              objectPosition: profile?.profileImage?.focalPoint
                ? `${profile.profileImage.focalPoint.x * 100}% ${profile.profileImage.focalPoint.y * 100}%`
                : "center",
            }}
          />
        </div>
        <div className="absolute left-0 right-0 top-0 z-2 h-[500px] bg-gradient-to-b from-black/60 to-transparent" />
        <div className="relative z-10 pt-[500px]">
          <div className="rounded-b-3xl bg-black px-4 pb-4">
            <h1 className={"flex items-center justify-center gap-1 text-4xl"}>
              {profile?.name ?? "Lawrence Brown"}
              <img src={checkmark} alt={"Checkmark"} width={21} height={21} />
            </h1>
            <h6 className={"flex items-center justify-center text-lg"}>
              {profile?.handle ? `@${profile.handle}` : "@lbdluxe"}
            </h6>
            {profile?.bio && (
              <p
                className={
                  "mt-2 text-center text-lg font-medium text-white max-w-sm whitespace-pre-line"
                }
              >
                {profile.bio}
              </p>
            )}
            <SocialLinks />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 z-1 left-1/2 -translate-x-1/2 flex w-[calc(100%-2rem)] max-w-[352px] justify-center md:top-8 md:max-w-[416px]">
        <div className="relative w-full">
          <img
            src={profile?.profileImage?.url ?? proPic}
            alt={"Profile Picture"}
            height={500}
            width={500}
            className={
              "w-full rounded-none object-cover md:rounded-2xl"
            }
            style={{
              objectPosition: profile?.profileImage?.focalPoint
                ? `${profile.profileImage.focalPoint.x * 100}% ${profile.profileImage.focalPoint.y * 100}%`
                : "center",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black to-transparent pointer-events-none md:rounded-b-2xl" />
        </div>
      </div>
      <div
        className={
          "relative bottom-0 z-10 flex w-full flex-col items-center justify-center bg-linear-to-b from-transparent to-black px-4 pt-[60%] md:pt-[60%]"
        }
      >
        <h1 className={"flex items-center justify-center gap-1 text-4xl"}>
          {profile?.name ?? "Lawrence Brown"}
          <img src={checkmark} alt={"Checkmark"} width={21} height={21} />
        </h1>
        <h6 className={"flex items-center justify-center text-lg"}>
          {profile?.handle ? `@${profile.handle}` : "@lbdluxe"}
        </h6>
        {profile?.bio && (
          <p
            className={
              "mt-2 text-center text-lg font-medium text-white max-w-sm whitespace-pre-line"
            }
          >
            {profile.bio}
          </p>
        )}
        <SocialLinks />
      </div>
    </>
  );
};

