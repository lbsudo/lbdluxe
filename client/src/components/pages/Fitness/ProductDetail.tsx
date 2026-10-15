import { useState } from "react"
import type { CMSFitnessProduct } from "shared"
import { ShieldAlert, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { AgeGate } from "./AgeGate"
import { useTilt } from "./use-tilt"
import { usePolarCheckout } from "./use-polar-checkout"
import { WaitlistForm } from "./WaitlistForm"
import { FITNESS_TYPE_META, formatPrice, isPurchasable } from "./fitness-utils"

const REGION_LABELS: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  UK: "United Kingdom",
  EU: "European Union",
  INTL: "International",
}

export function ProductDetail({ product }: { product: CMSFitnessProduct }) {
  const tiltRef = useTilt<HTMLDivElement>()
  const { buying, open } = usePolarCheckout(product.polarCheckoutLink)
  const purchasable = isPurchasable(product)
  const typeMeta = FITNESS_TYPE_META[product.type]

  const images = [
    product.coverImage,
    ...(product.gallery ?? []).map((g) => g.image),
  ].filter((m): m is NonNullable<typeof m> => Boolean(m?.url))

  const [activeImage, setActiveImage] = useState(0)
  const current = images[activeImage]

  const regions = (product.availableRegions ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean)
    .map((r) => REGION_LABELS[r] ?? r)

  return (
    <AgeGate enabled={Boolean(product.ageRestricted)}>
      <div className="shop-3d mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 md:flex-row">
        {/* 3D gallery */}
        <div className="w-full shrink-0 md:w-1/2">
          <div
            ref={tiltRef}
            className="shop-tilt group relative flex aspect-square items-center justify-center rounded-2xl p-4"
          >
            <div aria-hidden className="shop-panel absolute inset-0" />
            {current?.url ? (
              <img
                src={current.url}
                alt={product.title}
                className="shop-pop relative z-10 size-full rounded-xl object-cover"
              />
            ) : (
              <div className="shop-pop relative z-10 flex size-full items-center justify-center text-muted-foreground">
                {typeMeta.icon}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.url ?? i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "size-16 shrink-0 overflow-hidden rounded-lg border transition-all",
                    i === activeImage
                      ? "border-primary shadow-[0_0_14px_-2px_var(--primary)]"
                      : "border-border opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={img.url ?? ""} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Glass info panel */}
        <div className="shop-panel relative flex flex-1 flex-col gap-4 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary [filter:drop-shadow(0_0_10px_var(--primary))]">
              {typeMeta.icon}
            </span>
            <span>{typeMeta.singular}</span>
            {product.badge && (
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="font-bebas text-4xl leading-[1] tracking-wide text-foreground sm:text-5xl">
            {product.title}
          </h1>

          <div className="font-bebas text-3xl tracking-wide text-primary [text-shadow:0_0_24px_var(--primary)]">
            {formatPrice(product.price, product.currency)}
          </div>

          {product.shortDescription && (
            <p className="text-muted-foreground">{product.shortDescription}</p>
          )}

          {product.description && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}

          {product.shippingNote && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4" />
              {product.shippingNote}
            </p>
          )}

          {regions.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Available in: {regions.join(", ")}
            </p>
          )}

          <div className="mt-2">
            {purchasable ? (
              <button
                type="button"
                onClick={open}
                disabled={buying}
                className="shop-btn w-full px-4 py-3 text-sm sm:w-auto"
              >
                {buying
                  ? "Opening checkout…"
                  : `Buy now — ${formatPrice(product.price, product.currency)}`}
              </button>
            ) : (
              <div className="shop-panel rounded-xl p-4">
                <p className="mb-3 font-bebas text-lg tracking-wide text-foreground">
                  Coming soon
                </p>
                <WaitlistForm
                  interest={product.slug ?? product.type}
                  label="Be the first to know when this launches."
                />
              </div>
            )}
          </div>

          {product.ageRestricted && (
            <p className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-400">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              Age-restricted. You must be of legal age to purchase this product.
            </p>
          )}

          {product.disclaimer && (
            <div className="border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.disclaimer }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </AgeGate>
  )
}
