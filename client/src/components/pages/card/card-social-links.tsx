import type { CMSBusinessCard } from "shared"
import { getFaviconUrl, resolveSocialIcon } from "@/lib/resolve-social-icon"
import SocialLink from "@/components/pages/links/profile/SocialLinks/SocialLink"

interface Props {
  card: CMSBusinessCard
  accent: string
}

export function CardSocialLinks({ card, accent }: Props) {
  const links = card.socialLinks || []
  if (links.length === 0) return null
  return (
    <section className="flex w-full flex-wrap items-center justify-center gap-3">
      {links.map((l) => {
        if (l.iconType === "custom" && l.icon?.url) {
          return (
            <SocialLink
              key={l.id || l.url}
              href={l.url}
              target="_blank"
              ariaLabel={l.title}
              iconName="FaGlobe"
              hex={accent}
              customSrc={l.icon.url}
            />
          )
        }
        const { iconName, hexColor } = resolveSocialIcon(l.url)
        return (
          <SocialLink
            key={l.id || l.url}
            href={l.url}
            target="_blank"
            ariaLabel={l.title}
            iconName={iconName}
            hex={hexColor}
            customSrc={getFaviconUrl(l.url)}
          />
        )
      })}
    </section>
  )
}
