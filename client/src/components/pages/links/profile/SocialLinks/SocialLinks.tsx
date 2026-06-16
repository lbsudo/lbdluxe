import SocialLink from "./SocialLink";

export default function SocialLinks() {
  return (
    <>
      <div className={"mt-2 flex flex-row items-center justify-center gap-2"}>
        <SocialLink
          href={"https://www.linkedin.com/in/lbsudo"}
          target={"_blank"}
          ariaLabel={"Visit my LinkedIn"}
          iconName={"SiLinkerd"}
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
    </>
  );
}
