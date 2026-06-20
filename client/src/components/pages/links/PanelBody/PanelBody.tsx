import { LinkCardSm } from "./LinkCardSm";
import { LinkCardLg } from "./LinkCardLg";
import { Contacts } from "./Contacts";
import { NoThumbLink } from "../profile/SocialLinks/no-thumb-link";

export const PanelBody = async () => {
  return (
    <>
      <div
        className={
          "relative z-10 mx-4 flex w-full flex-col items-center justify-center bg-black px-4 pb-4"
        }
      >
        <LinkCardLg
          linkUrl={"https://currencycovenant.com"}
          img={`../../../../assets/ogfb.png`}
          title={"Currency Covenant - Full-Service Digital Agency"}
          hex={"#FFFFFF"}
          slIconName={"SlLink"}
        />
        <div className={"flex w-full items-center justify-center gap-2"}>
          <LinkCardSm
            linkUrl={"https://www.instagram.com/lbdluxe"}
            img={`../../../../assets/ccLinkcover.svg`}
            title={"Instagram"}
            hex={"#FFFFFF"}
            siIconName={"SiInstagram"}
          />
          <LinkCardSm
            linkUrl={"https://www.facebook.com/profile.php?id=61565967334501"}
            img={`../../../../assets/ccLinkcover.svg`}
            title={"Facebook"}
            hex={"#FFFFFF"}
            siIconName={"SiFacebook"}
          />
        </div>

        <div className={"flex w-full items-center justify-center gap-2"}>
          <LinkCardSm
            linkUrl={"https://covenantsociety.com"}
            img={`../../../../assets/ccLinkcover.svg`}
            title={"Covenant Society Apparel"}
            hex={"#FFFFFF"}
            slIconName={"SlBag"}
          />
          <LinkCardSm
            linkUrl={"https://discord.gg/yrrbDbKe"}
            img={`../../../../assets/ccLinkcover.svg`}
            title={"Covenant Society Discord"}
            hex={"#FFFFFF"}
            siIconName={"SiDiscord"}
          />
        </div>
        <NoThumbLink
          linkUrl={"/links/rumble-links"}
          title={"Rumble Network"}
          siIconName={"SiRumble"}
          hex={"#3E8E41"}
          target={"_self"}
        />
        <NoThumbLink
          linkUrl={"/links/yt-links"}
          title={"Youtube Network"}
          siIconName={"SiYoutube"}
          hex={"#FF0000"}
          target={"_self"}
        />
        <Contacts />
      </div>
    </>
  );
};
