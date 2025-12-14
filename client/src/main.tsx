import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/global.css";

import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "@/components/global/constants/context/use-themes.tsx";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found.");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="lbdluxe-theme">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}

/* -----------------------------------------------------
   🌟 SPLASH SCREEN CONTROL (ZERO SNAP, 3s DURATION)
----------------------------------------------------- */
const splash = document.getElementById("splash-screen");

if (splash) {
  // Reveal splash only AFTER the first layout + paint
  requestAnimationFrame(() => {
    splash.style.visibility = "visible";
  });

  // Keep the splash visible for 3 seconds
  setTimeout(() => {
    splash.style.transition = "opacity 700ms ease";
    splash.style.opacity = "0";

    // Remove from DOM after fade-out
    setTimeout(() => {
      splash.remove();
    }, 400);
  }, 1000);
}
