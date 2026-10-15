import { ThemeProvider } from "@/components/global/constants/theme/use-themes";
import { AppToaster } from "@/components/global/constants/AppToaster";
import { lazy, Suspense } from "react";
import {
  createRootRoute,
  redirect,
  Outlet,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

// The router devtools must never enter the production bundle. Gating on
// import.meta.env.DEV lets Rollup drop the dynamic import entirely for prod.
const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      })),
    )
  : () => null;

// The shop subdomain is the shop and nothing else: its root is the storefront
// and every non-shop path is bounced to the main site so the two hosts never
// serve duplicate content.
export const Route = createRootRoute({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const path = window.location.pathname;
      if (host === "links.lbdluxe.com" && path === "/") {
        throw redirect({ to: "/links" });
      }
      if (host === "shop.lbdluxe.com") {
        if (path === "/") {
          throw redirect({ to: "/fitness" });
        }
        if (!path.startsWith("/fitness")) {
          throw redirect({ href: `https://lbdluxe.com${path}` });
        }
      }
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
  }),
  component: () => (
    <>
      <ThemeProvider>
        <HeadContent />
        <Outlet />
        <AppToaster />
        {import.meta.env.DEV && (
          <Suspense fallback={null}>
            <TanStackRouterDevtools />
          </Suspense>
        )}
      </ThemeProvider>
      <Scripts />
    </>
  ),
});
