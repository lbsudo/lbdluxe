import { useState } from "react"
import type { CMSFitnessProduct } from "shared"
import { ShieldAlert, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { AgeGate } from "./AgeGate"
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
    <AgeGate>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-4 md:flex-row">
        <div className="w-full shrink-0 md:w-1/2">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            {current?.url ? (
              <img src={current.url} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                {typeMeta.icon}
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.url ?? i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "size-16 shrink-0 overflow-hidden rounded-md border",
                    i === activeImage ? "border-primary" : "border-border opacity-70",
                  )}
                >
                  <img src={img.url ?? ""} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {typeMeta.icon}
            <span>{typeMeta.singular}</span>
            {product.badge && (
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold">{product.title}</h1>

          <div className="text-2xl font-bold">
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
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {buying ? "Opening checkout…" : `Buy now — ${formatPrice(product.price, product.currency)}`}
              </button>
            ) : (
              <div className="rounded-lg border p-4">
                <p className="mb-3 text-sm font-semibold">Coming soon</p>
                <WaitlistForm
                  interest={product.slug ?? product.type}
                  label="Be the first to know when this launches."
                />
              </div>
            )}
          </div>

          {product.ageRestricted && (
            <p className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              Age-restricted. You must be of legal age to purchase this product.
            </p>
          )}

          {product.disclaimer && (
            <div className="border-t pt-4 text-xs text-muted-foreground">
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
