import type { CMSBusinessCard, CMSBusinessCardLogo } from "shared"

interface Props {
  card: CMSBusinessCard
  accent: string
}

const bannerLogos = (card: CMSBusinessCard): CMSBusinessCardLogo[] =>
  (card.logos || []).filter((l) => (l.position || "banner") === "banner" && l.image?.url)

const belowLogos = (card: CMSBusinessCard): CMSBusinessCardLogo[] =>
  (card.logos || []).filter((l) => l.position === "below" && l.image?.url)

export function CardHero({ card, accent }: Props) {
  const accreditations = (card.accreditations || []).filter((a) => a.name)
  const banner = bannerLogos(card)
  const below = belowLogos(card)
  const legacyLogo = !banner.length ? card.companyLogo?.url : null

  return (
    <section className="w-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
      {/* Banner band with profile picture + banner logos overlapping the bottom edge */}
      <div className="relative h-40 w-full overflow-hidden">
        {card.coverImage?.url ? (
          <img
            src={card.coverImage.url}
            alt={card.coverImage.alt || "Cover"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(135deg, ${accent}, #0a0a0a)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />

        {/* Profile picture (left) and logo tile(s) (right), aligned over the banner */}
        <div className="absolute inset-x-4 bottom-0 flex translate-y-1/2 items-end justify-between gap-3">
          <div
            className="h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-[#0a0a0a]"
            style={{ boxShadow: `0 0 0 3px ${accent}` }}
          >
            {card.profileImage?.url ? (
              <img
                src={card.profileImage.url}
                alt={card.profileImage.alt || card.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                style={{ background: accent }}
              >
                {card.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-end justify-end gap-2 pb-1">
            {banner.map((l) => (
              <a
                key={l.id || l.image?.url}
                href={l.url ?? undefined}
                target={l.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white/90 p-1.5 ring-1 ring-white/20"
              >
                <img
                  src={l.image!.url!}
                  alt={l.alt || l.image?.alt || "Logo"}
                  className="h-full w-full object-contain"
                />
              </a>
            ))}
            {legacyLogo && (
              <img
                src={legacyLogo}
                alt={card.company || "Company logo"}
                className="h-16 max-w-[96px] object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Name / title / company / bio / accreditations (Blinq: left-aligned) */}
      <div className="flex flex-col gap-1 px-6 pb-6 pt-16 text-left">
        <h1 className="text-3xl font-bold tracking-tight">{card.name}</h1>
        {card.headline && (
          <p className="text-base font-medium text-white/90">{card.headline}</p>
        )}
        {card.title && <p className="text-sm text-white/70">{card.title}</p>}
        {card.department && <p className="text-xs text-white/50">{card.department}</p>}
        {card.company && (
          <p className="text-xs uppercase tracking-widest text-white/50">{card.company}</p>
        )}
        {card.bio && (
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70 whitespace-pre-line">
            {card.bio}
          </p>
        )}
        {accreditations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {accreditations.map((a) => (
              <span
                key={a.id || a.name}
                className="rounded-full px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15"
                style={{ background: `${accent}33` }}
              >
                {a.name}
              </span>
            ))}
          </div>
        )}

        {below.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {below.map((l) => (
              <a
                key={l.id || l.image?.url}
                href={l.url ?? undefined}
                target={l.url ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center overflow-hidden rounded-lg bg-white/90 p-1.5 ring-1 ring-white/20"
              >
                <img
                  src={l.image!.url!}
                  alt={l.alt || l.image?.alt || "Logo"}
                  className="h-full object-contain"
                />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
