import type { CMSBusinessCard } from "shared"

interface Props {
  card: CMSBusinessCard
  accent: string
}

export function CardHero({ card, accent }: Props) {
  return (
    <section className="w-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
      {card.coverImage?.url ? (
        <div className="relative h-32 w-full overflow-hidden">
          <img
            src={card.coverImage.url}
            alt={card.coverImage.alt || "Cover"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        </div>
      ) : (
        <div
          className="h-24 w-full"
          style={{
            background: `linear-gradient(135deg, ${accent}22, transparent)`,
          }}
        />
      )}
      <div className="flex flex-col items-center px-6 pb-6 pt-2 text-center">
        <div className="-mt-12 h-24 w-24 overflow-hidden rounded-full ring-4 ring-[#0a0a0a]">
          {card.profileImage?.url ? (
            <img
              src={card.profileImage.url}
              alt={card.profileImage.alt || card.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-3xl font-bold"
              style={{ background: accent, color: "#0a0a0a" }}
            >
              {card.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight">{card.name}</h1>
        {card.title && <p className="text-sm text-white/70">{card.title}</p>}
        {card.company && (
          <p className="text-xs uppercase tracking-widest text-white/50">{card.company}</p>
        )}
        {card.bio && (
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80 whitespace-pre-line">
            {card.bio}
          </p>
        )}
      </div>
    </section>
  )
}
