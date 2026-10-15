import { ArrowUpRight } from "lucide-react"
import { SHOP_URL } from "@/lib/seo"

/**
 * Teaser for the fitness storefront (shop.lbdluxe.com), rendered as the
 * first card of the main site's products grid. Clicking it routes to the
 * shop subdomain.
 *
 * Styling is deliberately self-contained (raw colors, no design tokens): the
 * card is a window into the shop's dark-neon world, so it looks identical
 * whether the main site is in light or dark mode. The spinning cube and grid
 * floor reuse the shop's CSS (see .shop-cube / .shop-card-floor in
 * shop.css), which stays static under prefers-reduced-motion.
 */
export function ShopCard() {
  return (
    <a
      href={SHOP_URL}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-cyan-400/40 bg-[#07070d] shadow-[0_0_36px_-12px_rgba(34,211,238,0.5)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
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
        <span className="absolute left-2 top-2 rounded bg-cyan-400 px-2 py-0.5 text-xs font-semibold text-black">
          SHOP
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-cyan-400/20 p-4 text-neutral-200">
        <h3 className="font-bebas text-xl leading-tight tracking-wide text-white">
          The Fitness Shop
        </h3>
        <p className="text-xs leading-relaxed text-neutral-400">
          Training programs, supplements, and research peptides — inside the
          3D storefront.
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-bebas text-sm tracking-widest text-cyan-300">
            SHOP.LBDLUXE.COM
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-cyan-400/90 px-3 py-1.5 text-xs font-semibold text-black transition-shadow group-hover:shadow-[0_0_18px_rgba(34,211,238,0.8)]">
            Enter <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </a>
  )
}
