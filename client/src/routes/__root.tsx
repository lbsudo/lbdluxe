import { ThemeProvider } from "@/components/global/constants/theme/use-themes";
import { AppToaster } from "@/components/global/constants/AppToaster";
import {
  createRootRoute,
  redirect,
  Outlet,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host === "links.lbdluxe.com" && window.location.pathname === "/") {
        throw redirect({ to: "/links" });
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
        <TanStackRouterDevtools />
      </ThemeProvider>
      <Scripts />
    </>
  ),
});
