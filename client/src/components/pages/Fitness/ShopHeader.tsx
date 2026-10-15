import { Link, useRouterState } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"
import { SITE_URL } from "@/lib/seo"
import {
  FITNESS_TYPE_META,
  FITNESS_TYPE_ORDER,
} from "@/components/pages/Fitness/fitness-utils"

/**
 * The shop's own top bar — the storefront never renders the main site's
 * ControlBar / mobile nav. Wordmark left, the three categories plus "All"
 * center, and a way back to the main site right.
 */
export function ShopHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-3 sm:px-4">
      <div className="shop-panel mx-auto flex w-full max-w-6xl flex-col gap-2 rounded-2xl px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/fitness" className="flex items-baseline gap-1.5" aria-label="Shop home">
            <span className="font-bebas text-xl tracking-wider text-foreground">
              LBDLUXE
            </span>
            <span className="font-bebas text-xl tracking-wider text-primary [text-shadow:0_0_18px_var(--primary)]">
              SHOP
            </span>
          </Link>
          <a
            href={SITE_URL}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary sm:hidden"
          >
            Main site <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        <nav className="flex items-center gap-1.5 overflow-x-auto py-1" aria-label="Shop categories">
          <Link
            to="/fitness"
            className="shop-tab"
            data-active={pathname === "/fitness"}
          >
            All
          </Link>
          {FITNESS_TYPE_ORDER.map((t) => (
            <Link
              key={t}
              to="/fitness/$type"
              params={{ type: t }}
              className="shop-tab"
              data-active={
                pathname === `/fitness/${t}` || pathname.startsWith(`/fitness/${t}/`)
              }
            >
              {FITNESS_TYPE_META[t].label}
            </Link>
          ))}
        </nav>

        <a
          href={SITE_URL}
          className="hidden items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary sm:flex"
        >
          Main site <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </header>
  )
}
