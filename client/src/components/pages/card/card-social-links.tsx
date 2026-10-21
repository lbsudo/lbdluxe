import type { CMSBusinessCard } from "shared"
import { getFaviconUrl, resolveSocialIcon } from "@/lib/resolve-social-icon"
import { siIconMap } from "@/components/icons"

interface Props {
  card: CMSBusinessCard
  accent: string
}

export function CardSocialLinks({ card, accent }: Props) {
  const links = card.socialLinks || []
  if (links.length === 0) return null
  return (
    <section className="grid w-full grid-cols-2 gap-3">
      {links.map((l) => {
        const custom = l.iconType === "custom" && l.icon?.url ? l.icon.url : null
        const resolved = resolveSocialIcon(l.url).iconName
        const Icon = custom || resolved === "FaGlobe" ? undefined : siIconMap[resolved]
        return (
          <a
            key={l.id || l.url}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.title}
            className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              {custom ? (
                <img src={custom} alt="" className="h-5 w-5 rounded-full object-cover" />
              ) : Icon ? (
                <Icon className="h-5 w-5" style={{ color: accent }} />
              ) : (
                <img src={getFaviconUrl(l.url)} alt="" className="h-5 w-5 rounded-full object-cover" />
              )}
            </span>
            <span className="truncate">{l.title}</span>
          </a>
        )
      })}
    </section>
  )
}
