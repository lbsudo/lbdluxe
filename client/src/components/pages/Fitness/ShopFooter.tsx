import { SITE_URL } from "@/lib/seo"

/**
 * Minimal shop footer: wordmark, a shipping/compliance line, and a way
 * back to the main site. Product-level disclaimers live on the product
 * pages — this stays light.
 */
export function ShopFooter() {
  return (
    <footer className="relative z-10 mt-16 w-full border-t border-border/60 px-4 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 text-center">
        <p className="font-bebas text-lg tracking-[0.25em] text-muted-foreground">
          LBDLUXE · THE SHOP
        </p>
        <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
          Programs are delivered instantly as digital downloads. Supplements and
          peptides ship to the regions listed on each product.
        </p>
        <a
          href={SITE_URL}
          className="text-xs text-primary transition-opacity hover:opacity-80"
        >
          ← Back to lbdluxe.com
        </a>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} LBDLUXE
        </p>
      </div>
    </footer>
  )
}
