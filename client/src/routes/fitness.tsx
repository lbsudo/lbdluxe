import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import ShopLayout from "@/layouts/shop-layout";
import { isShopHost } from "@/lib/shop-host";

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
