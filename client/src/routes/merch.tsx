import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import ShopLayout from "@/layouts/shop-layout";
import { isShopHost } from "@/lib/shop-host";

export const Route = createFileRoute("/merch")({
  beforeLoad: ({ location }) => {
    if (typeof window !== "undefined" && !isShopHost(window.location.hostname)) {
      throw redirect({
        href: `https://shop.lbdluxe.com${location.pathname}${location.search}`,
      });
    }
  },
  component: LifewavePageLayout,
});

function LifewavePageLayout() {
  return (
    <ShopLayout>
      <Outlet />
    </ShopLayout>
  );
}
