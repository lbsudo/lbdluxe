import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { SHOP_URL } from "@/lib/seo"

const COVENANT_SHOP_URL = "https://shop.currencycovenant.com"

/** Accent palettes for the matched shop cards (Tailwind class sets). */
const ACCENTS = {
  cyan: {
    /** Wireframe color for the cube + grid floor (inherited by shop.css). */
    neon: "oklch(0.87 0.15 195)",
    card: "border-cyan-400/40 shadow-[0_0_36px_-12px_rgba(34,211,238,0.5)] focus-visible:outline-cyan-400",
    badge: "bg-cyan-400 text-black",
    divider: "border-cyan-400/20",
    url: "text-cyan-300",
    enter:
      "bg-cyan-400/90 text-black group-hover:shadow-[0_0_18px_rgba(34,211,238,0.8)]",
  },
  crimson: {
    neon: "oklch(0.66 0.21 22)",
    card: "border-rose-500/40 shadow-[0_0_36px_-12px_rgba(225,29,72,0.5)] focus-visible:outline-rose-500",
    badge: "bg-rose-500 text-white",
    divider: "border-rose-500/20",
    url: "text-rose-300",
    enter:
      "bg-rose-500/90 text-white group-hover:shadow-[0_0_18px_rgba(225,29,72,0.8)]",
  },
} as const

type Accent = keyof typeof ACCENTS

interface NeonShopCardProps {
  href: string
  badge: string
  title: string
  description: string
  urlLabel: string
  accent: Accent
}

/**
 * The matched shop-card design used in the main site's products grid: a
 * dark neon "window into the shop" — spinning CSS cube over a perspective
 * grid floor. Styling is deliberately self-contained (raw colors, no design
 * tokens) so it looks identical whether the main site is in light or dark
 * mode; the accent carries each shop's brand. Animations freeze under
 * prefers-reduced-motion (see shop.css).
 */
function NeonShopCard({
  href,
  badge,
  title,
  description,
  urlLabel,
  accent,
}: NeonShopCardProps) {
  const a = ACCENTS[accent]
  return (
    <a
      href={href}
      style={{ "--neon-accent": a.neon } as CSSProperties}
      className={`group relative flex flex-col overflow-hidden rounded-lg border bg-[#07070d] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${a.card}`}
    >
      <div className="shop-card-scene relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#07070d]">
        <div className="shop-card-floor" aria-hidden />
        <div className="shop-cube-wrap" aria-hidden>
          <div className="shop-cube">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <span className={`absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-semibold ${a.badge}`}>
          {badge}
        </span>
      </div>

      <div className={`flex flex-1 flex-col gap-2 border-t p-4 text-neutral-200 ${a.divider}`}>
        <h3 className="font-bebas text-xl leading-tight tracking-wide text-white">
          {title}
        </h3>
        <p className="text-xs leading-relaxed text-neutral-400">{description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className={`font-bebas text-sm tracking-widest ${a.url}`}>
            {urlLabel}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-shadow ${a.enter}`}
          >
            Enter <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </a>
  )
}

/**
 * The personal product shop (shop.lbdluxe.com) — products sold directly by
 * Lawrence, not under a company.
 */
export function PersonalShopCard() {
  return (
    <NeonShopCard
      href={SHOP_URL}
      badge="PERSONAL"
      title="Personal Product Shop"
      description="Training programs, supplements, and research peptides — products I sell directly. Personal, not a company."
      urlLabel="SHOP.LBDLUXE.COM"
      accent="cyan"
    />
  )
}

/**
 * The Currency Covenant company store (shop.currencycovenant.com) — premium
 * streetwear & apparel, in the same matched card design with the Covenant
 * crimson accent.
 */
export function CovenantShopCard() {
  return (
    <NeonShopCard
      href={COVENANT_SHOP_URL}
      badge="CURRENCY COVENANT"
      title="Covenant Apparel"
      description="Premium streetwear & apparel from Currency Covenant — the company store."
      urlLabel="SHOP.CURRENCYCOVENANT.COM"
      accent="crimson"
    />
  )
}
