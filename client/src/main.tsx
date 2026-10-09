import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cmsSiteQuery } from "@/hooks/server/cms/GET/useCMSSite";
import { cmsPageQuery } from "@/hooks/server/cms/GET/useCMSPage";
import { cmsLinksProfileQuery } from "@/hooks/server/cms/GET/useCMSLinksProfile";
import { cmsProfileLinksQuery } from "@/hooks/server/cms/GET/useCMSProfileLinks";
import { cmsContentNetworksQuery } from "@/hooks/server/cms/GET/useCMSContentNetworks";
import { cmsPostsQuery } from "@/hooks/server/cms/GET/useCMSPosts";
import { cmsPostQuery } from "@/hooks/server/cms/GET/useCMSPost";
import { cmsShelfCategoriesQuery } from "@/hooks/server/cms/GET/useCMSShelfCategories";
import { cmsDigitalProductsQuery } from "@/hooks/server/cms/GET/useCMSDigitalProducts";
import {
  cmsShelfItemQuery,
  cmsShelfItemsQuery,
} from "@/hooks/server/cms/GET/useCMSShelfItems";
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

// The splash preloader feeds these into react-query's prefetchQuery. The hooks
// export fully-typed UseQueryOptions<T>; `object` keeps the heterogeneous list
// homogeneous without an `any` and the exact shape is restored at the call site.
type CriticalQuery = object;

// Queries every links.lbdluxe.com page needs before first paint. The profile
// details, link cards, content networks and footer socials all consume these,
// so warming them during the splash means the app renders with data present.
const LINK_BASE_QUERIES: CriticalQuery[] = [
  cmsSiteQuery,
  cmsLinksProfileQuery,
  cmsProfileLinksQuery,
  cmsContentNetworksQuery,
];

function criticalQueriesFor({
  hostname,
  pathname,
  search,
}: {
  hostname: string;
  pathname: string;
  search: string;
}): CriticalQuery[] {
  const host = hostname.replace(/^www\./, "");
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

  if (host === "links.lbdluxe.com" || path.startsWith("/links")) {
    return LINK_BASE_QUERIES;
  }

  if (path === "/") return [cmsSiteQuery, cmsPageQuery("home")];
  if (path === "/works") return [cmsSiteQuery, cmsPageQuery("works")];
  if (path === "/products")
    return [cmsSiteQuery, cmsPageQuery("products"), cmsDigitalProductsQuery];

  if (path === "/shelf") {
    const rawCategory = new URLSearchParams(search).get("category");
    const category = Number(rawCategory);
    const itemsQuery = Number.isFinite(category) && category > 0
      ? [cmsShelfItemsQuery(category)]
      : [];
    return [
      cmsSiteQuery,
      cmsPageQuery("shelf"),
      cmsShelfCategoriesQuery,
      ...itemsQuery,
    ];
  }

  if (path === "/shelf-items") {
    return [cmsSiteQuery, cmsPageQuery("shelf-items"), cmsShelfItemsQuery()];
  }
  if (path.startsWith("/shelf-items/")) {
    const slug = decodeURIComponent(path.slice("/shelf-items/".length));
    return [
      cmsSiteQuery,
      cmsPageQuery("shelf-items"),
      cmsShelfItemQuery(slug),
    ];
  }

  if (path === "/blog" || path === "/blog/") {
    return [cmsSiteQuery, cmsPageQuery("blog"), cmsPostsQuery];
  }
  if (path.startsWith("/blog/")) {
    const slug = decodeURIComponent(path.slice("/blog/".length));
    return [cmsSiteQuery, cmsPageQuery("blog"), cmsPostQuery(slug)];
  }

  return [cmsSiteQuery];
}

// Safety cap: an unhandled route, blocked request, or flaky network must never
// leave the splash on screen forever. Queries usually settle well before this.
const SPLASH_MAX_MS = 6000;

function AppWrapper() {
  const [showSplash, setShowSplash] = useState(false);
  const [appVisible, setAppVisible] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let revealed = false;
    let settled = 0;

    let showSplashNow = false;
    try {
      if (!sessionStorage.getItem("splashShown")) {
        showSplashNow = true;
      }
    } catch {
      showSplashNow = true;
    }

    if (!showSplashNow) {
      setAppVisible(true);
      return;
    }

    // Mount the router behind the black splash immediately so the current
    // (code-split) route starts loading and paints while the splash is up.
    // By reveal time the page is fully rendered underneath, so the fade-out
    // reveals real content instead of a blank white frame.
    setAppVisible(true);

    const reveal = () => {
      if (revealed || cancelled) return;
      revealed = true;
      requestAnimationFrame(() => {
        if (cancelled) return;
        setShowSplash(false);
      });
      try {
        sessionStorage.setItem("splashShown", "true");
      } catch (err) {
        console.error(err);
      }
    };

    const queries = criticalQueriesFor(window.location);

    setShowSplash(true);
    if (queries.length === 0) {
      reveal();
      return;
    }

    // No-minimum reveal: the splash hides the moment every critical query has
    // settled. This fires only as a last resort if a query hangs.
    const capTimer = setTimeout(reveal, SPLASH_MAX_MS);

    queries.forEach((query) => {
      queryClient
        .prefetchQuery(query as Parameters<QueryClient["prefetchQuery"]>[0])
        .catch(() => {})
        .finally(() => {
          settled += 1;
          setSplashProgress(settled / queries.length);
        });
    });

    return () => {
      cancelled = true;
      clearTimeout(capTimer);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen
        visible={showSplash}
        progress={splashProgress}
        fadeOutMs={180}
        onHidden={() => {
          setAppVisible(true);
        }}
      />
      {appVisible && <RouterProvider router={router} />}
    </QueryClientProvider>
  );
}

export default AppWrapper;

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the id is correct.",
  );
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AppWrapper />);
}