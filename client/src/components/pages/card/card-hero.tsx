import type { CMSBusinessCard } from "shared"

interface Props {
  card: CMSBusinessCard
  accent: string
}

export function CardHero({ card, accent }: Props) {
  return (
    <section className="w-full overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
      {card.coverImage?.url ? (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={card.coverImage.url}
            alt={card.coverImage.alt || "Cover"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        </div>
      ) : (
        <div
          className="h-32 w-full"
          style={{
            background: `linear-gradient(135deg, ${accent}, #0a0a0a)`,
          }}
        />
      )}
      <div className="flex flex-col items-center px-6 pb-8 pt-2 text-center">
        <div
          className="-mt-14 h-28 w-28 overflow-hidden rounded-full ring-4 ring-[#0a0a0a]"
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
              className="flex h-full w-full items-center justify-center text-4xl font-bold text-white"
              style={{ background: accent }}
            >
              {card.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{card.name}</h1>
        {card.title && <p className="mt-1 text-base text-white/80">{card.title}</p>}
        {card.company && (
          <p className="mt-1 text-xs uppercase tracking-widest text-white/50">{card.company}</p>
        )}
        {card.bio && (
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70 whitespace-pre-line">
            {card.bio}
          </p>
        )}
      </div>
    </section>
  )
}
