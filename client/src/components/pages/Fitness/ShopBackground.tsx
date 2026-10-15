/**
 * Ambient scene behind every shop page: layered neon glows plus the
 * perspective grid floor scrolling toward the viewer. Purely decorative
 * (aria-hidden) and fixed behind content; all animation is disabled under
 * prefers-reduced-motion (see shop.css).
 */
export function ShopBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="shop-bg absolute inset-0" />
      <div className="shop-floor-wrap">
        <div className="shop-floor" />
      </div>
    </div>
  )
}
