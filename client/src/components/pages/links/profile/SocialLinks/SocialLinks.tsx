import SocialLink from "./SocialLink";
import { getFaviconUrl, resolveSocialIcon } from "@/lib/resolve-social-icon";
import type { CMSLinksProfile } from "shared";

interface Props {
  socialLinks?: CMSLinksProfile["socialLinks"];
}

export default function SocialLinks({ socialLinks }: Props) {
  if (socialLinks && socialLinks.length > 0) {
    return (
      <div className={"mt-2 flex flex-row items-center justify-center gap-2"}>
        {socialLinks.map((link) => {
          if (link.iconType === "custom" && link.icon?.url) {
            return (
              <SocialLink
                key={link.id}
                href={link.url}
                target={"_blank"}
                ariaLabel={`Visit ${link.title}`}
                iconName={"FaGlobe"}
                hex={"#666666"}
                customSrc={link.icon.url}
              />
            );
          }

          const faviconUrl = getFaviconUrl(link.url);
          const { iconName, hexColor } = resolveSocialIcon(link.url);
          return (
            <SocialLink
              key={link.id}
              href={link.url}
              target={"_blank"}
              ariaLabel={`Visit ${link.title}`}
              iconName={iconName}
              hex={hexColor}
              customSrc={faviconUrl}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={"mt-2 flex flex-row items-center justify-center gap-2"}>
      <SocialLink
        href={"https://www.linkedin.com/in/lbsudo"}
        target={"_blank"}
        ariaLabel={"Visit my LinkedIn"}
        iconName={"SiLinkedin"}
        hex={"#0e76a8"}
      />
      <SocialLink
        href={"https://www.tiktok.com/@lbdluxe"}
        target={"_blank"}
        ariaLabel={"Visit my TikTok"}
        iconName={"SiTiktok"}
        hex={"#000000"}
      />
      <SocialLink
        href={"https://www.instagram.com/lbdluxe"}
        target={"_blank"}
        ariaLabel={"Visit my instagram"}
        iconName={"SiInstagram"}
        hex={"#E4405F"}
      />
      <SocialLink
        href={"https://www.facebook.com/profile.php?id=61565967334501"}
        target={"_blank"}
        ariaLabel={"Visit my Facebook"}
        iconName={"SiFacebook"}
        hex={"#3b5998"}
      />
      <SocialLink
        href={"https://www.rumble.com/c/c-6589313"}
        target={"_blank"}
        ariaLabel={"Visit my Rumble"}
        iconName={"SiRumble"}
        hex={"#8BC34A"}
      />
      <SocialLink
        href={"https://www.youtube.com/@lbdluxe"}
        target={"_blank"}
        ariaLabel={"Visit my Youtube"}
        iconName={"SiYoutube"}
        hex={"#c4302b"}
      />
    </div>
  );
}
