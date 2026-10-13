import { Link } from "@tanstack/react-router"
import type { CMSFitnessProduct } from "shared"
import { usePolarCheckout } from "./use-polar-checkout"
import { FITNESS_TYPE_META, formatPrice, isPurchasable } from "./fitness-utils"

interface FitnessProductCardProps {
  product: CMSFitnessProduct
}

export function FitnessProductCard({ product }: FitnessProductCardProps) {
  const { buying, open } = usePolarCheckout(product.polarCheckoutLink)
  const purchasable = isPurchasable(product)
  const typeMeta = FITNESS_TYPE_META[product.type]

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
      <Link
        to="/fitness/$type/$slug"
        params={{ type: product.type, slug: product.slug ?? "" }}
        className="block aspect-[4/3] relative overflow-hidden bg-muted"
      >
        {product.coverImage?.url ? (
          <img
            src={product.coverImage.url}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No cover
          </div>
        )}
        {product.badge && (
          <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            {product.badge}
          </span>
        )}
        {!purchasable && (
          <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            Coming soon
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {typeMeta.icon}
          <span>{typeMeta.singular}</span>
        </div>
        <Link
          to="/fitness/$type/$slug"
          params={{ type: product.type, slug: product.slug ?? "" }}
          className="line-clamp-1 text-sm font-semibold leading-tight hover:underline"
        >
          {product.title}
        </Link>
        {product.shortDescription && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="text-sm font-bold">
            {formatPrice(product.price, product.currency)}
          </span>
          {purchasable ? (
            <button
              type="button"
              onClick={open}
              disabled={buying}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {buying ? "Opening…" : "Buy now"}
            </button>
          ) : (
            <Link
              to="/fitness/$type/$slug"
              params={{ type: product.type, slug: product.slug ?? "" }}
              className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground transition-opacity hover:opacity-90"
            >
              Notify me
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
