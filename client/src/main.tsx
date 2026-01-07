import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/global.css";

const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppWrapper() {
  const [showSplash, setShowSplash] = useState(false);
  const [appVisible, setAppVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const alreadyShown = sessionStorage.getItem("splashShown");
      if (!alreadyShown) {
        setShowSplash(true);
        // Show splash for 2.5 s, then start fade‑out (0.5 s)
        timer = setTimeout(() => {
          setShowSplash(false);
          sessionStorage.setItem("splashShown", "true");
        }, 2500);
      } else {
        // Splash already shown this session – show app immediately
        setAppVisible(true);
      }
    } catch (e) {
      // Fallback: if sessionStorage is unavailable, just show splash once
      setShowSplash(true);
      timer = setTimeout(() => {
        setShowSplash(false);
      }, 2500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <SplashScreen visible={showSplash} onHidden={() => {
        setAppVisible(true);
      }} />
{appVisible && (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
)}
    </>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct."
  );
}

// Render the app
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AppWrapper />);
}
