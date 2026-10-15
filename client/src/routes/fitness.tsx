import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import ShopLayout from "@/layouts/shop-layout";

/**
 * Hosts allowed to render the shop. The shop is canonical on
 * shop.lbdluxe.com; the default Pages domain and its preview deployments
 * (*.lbdluxe.pages.dev) also render it so previews stay usable; local dev
 * hosts are allowed only in development builds.
 */
function isShopHost(hostname: string): boolean {
  if (hostname === "shop.lbdluxe.com") return true;
  if (hostname === "lbdluxe.pages.dev" || hostname.endsWith(".lbdluxe.pages.dev")) {
    return true;
  }
  if (
    import.meta.env.DEV &&
    (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]")
  ) {
    return true;
  }
  return false;
}

export const Route = createFileRoute("/fitness")({
  // The shop is its own site: anywhere it isn't canonical (the main host
  // and www), bounce the visitor to the subdomain instead of rendering a
  // second copy of the storefront.
  beforeLoad: ({ location }) => {
    if (typeof window !== "undefined" && !isShopHost(window.location.hostname)) {
      throw redirect({
        href: `https://shop.lbdluxe.com${location.pathname}${location.search}`,
      });
    }
  },
  component: ShopPageLayout,
});

/**
 * Shared chrome for every shop page. The per-product age gate lives on the
 * detail route so catalog/list pages stay indexable.
 */
function ShopPageLayout() {
  return (
    <ShopLayout>
      <Outlet />
    </ShopLayout>
  );
}
