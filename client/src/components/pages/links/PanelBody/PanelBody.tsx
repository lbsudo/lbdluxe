import { useCMSProfileLinks } from "@/hooks/server/cms/GET/useCMSProfileLinks"
import { LinkCardSm } from "./LinkCardSm";
import { LinkCardLg } from "./LinkCardLg";
import { Contacts } from "./Contacts";
import { NoThumbLink } from "../profile/SocialLinks/no-thumb-link";

export const PanelBody = () => {
  const { data: links, isLoading } = useCMSProfileLinks()

  if (isLoading) return null

  const sorted = [...(links ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const lgCards = sorted.filter((l) => l.linkType === "lg")
  const smCards = sorted.filter((l) => l.linkType === "sm")
  const smPairs: (typeof smCards)[] = []
  for (let i = 0; i < smCards.length; i += 2) {
    smPairs.push(smCards.slice(i, i + 2))
  }

  return (
    <>
      <div
        className={
          "relative z-10 flex w-full flex-col items-center justify-center bg-black px-4 pb-4"
        }
      >
        {lgCards.map((link) => (
          <LinkCardLg
            key={link.id}
            linkUrl={link.url}
            img={link.coverImage?.url ?? ""}
            title={link.title}
            hex={link.hexColor ?? "#FFFFFF"}
            slIconName={link.iconSet === "sl" ? (link.iconName as any) : undefined}
            siIconName={link.iconSet === "si" ? (link.iconName as any) : undefined}
            lucIconName={link.iconSet === "lucide" ? (link.iconName as any) : undefined}
          />
        ))}
        {smPairs.map((pair, i) => (
          <div key={i} className={"flex w-full items-center justify-center gap-2"}>
            {pair.map((link) => (
              <LinkCardSm
                key={link.id}
                linkUrl={link.url}
                img={link.coverImage?.url ?? ""}
                title={link.title}
                hex={link.hexColor ?? "#FFFFFF"}
                slIconName={link.iconSet === "sl" ? (link.iconName as any) : undefined}
                siIconName={link.iconSet === "si" ? (link.iconName as any) : undefined}
                lucIconName={link.iconSet === "lucide" ? (link.iconName as any) : undefined}
              />
            ))}
          </div>
        ))}
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
