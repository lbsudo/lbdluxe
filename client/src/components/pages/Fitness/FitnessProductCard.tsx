import { Link } from "@tanstack/react-router"
import type { CMSFitnessProduct } from "shared"
import { useTilt } from "./use-tilt"
import { usePolarCheckout } from "./use-polar-checkout"
import { FITNESS_TYPE_META, formatPrice, isPurchasable } from "./fitness-utils"

interface FitnessProductCardProps {
  product: CMSFitnessProduct
}

/**
 * 3D glass product card. The pointer tilt and cursor-following highlight
 * are progressive enhancements (see use-tilt); the depth pop on hover is
 * pure CSS (see .shop-tilt / .shop-pop in shop.css).
 *
 * Structure note: the glass surface is a child layer, not the tilt element
 * itself — backdrop-filter would flatten the 3D subtree, so the preserve-3d
 * element stays clean and the .shop-panel backing sits behind the content.
 */
export function FitnessProductCard({ product }: FitnessProductCardProps) {
  const tiltRef = useTilt<HTMLDivElement>()
  const { buying, open } = usePolarCheckout(product.polarCheckoutLink)
  const purchasable = isPurchasable(product)
  const typeMeta = FITNESS_TYPE_META[product.type]
  const detailParams = { type: product.type, slug: product.slug ?? "" }

  return (
    <div
      ref={tiltRef}
      className="shop-tilt group relative flex flex-col rounded-2xl"
    >
      <div aria-hidden className="shop-panel absolute inset-0" />

      <Link
        to="/fitness/$type/$slug"
        params={detailParams}
        className="shop-pop relative z-10 block aspect-[4/3] overflow-hidden rounded-t-[calc(var(--shop-radius)_-_1px)] bg-muted"
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
      </Link>

      {product.badge && (
        <span className="shop-pop-lg absolute left-3 top-3 z-20 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground shadow-[0_0_14px_-2px_var(--primary)]">
          {product.badge}
        </span>
      )}
      {!purchasable && (
        <span className="shop-pop-lg absolute right-3 top-3 z-20 rounded bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
          Coming soon
        </span>
      )}

      <div className="relative z-10 flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {typeMeta.icon}
          <span>{typeMeta.singular}</span>
        </div>
        <Link
          to="/fitness/$type/$slug"
          params={detailParams}
          className="line-clamp-1 text-sm font-semibold leading-tight hover:text-primary"
        >
          {product.title}
        </Link>
        {product.shortDescription && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-bebas text-lg tracking-wide">
            {formatPrice(product.price, product.currency)}
          </span>
          {purchasable ? (
            <button
              type="button"
              onClick={open}
              disabled={buying}
              className="shop-btn px-3 py-1.5 text-xs"
            >
              {buying ? "Opening…" : "Buy now"}
            </button>
          ) : (
            <Link
              to="/fitness/$type/$slug"
              params={detailParams}
              className="shop-tab px-3 py-1.5 text-xs"
            >
              Notify me
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
