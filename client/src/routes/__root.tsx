import { ThemeProvider } from "@/components/global/constants/theme/use-themes";
import { AppToaster } from "@/components/global/constants/AppToaster";
import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "BHVR",
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
