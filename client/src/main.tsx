import { useCallback, useEffect, useState } from "react";
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

// The site global and links profile/link cards are shared by every
// links.lbdluxe.com page, so they always belong in the critical set.
const LINK_BASE_QUERIES: CriticalQuery[] = [
  cmsSiteQuery,
  cmsLinksProfileQuery,
  cmsProfileLinksQuery,
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
    // The network panels (yt/rumble) additionally need the content networks,
    // but the base /links page does not — don't make it wait on that request.
    const needsNetworks =
      path.includes("yt-links") || path.includes("rumble-links");
    return needsNetworks
      ? [...LINK_BASE_QUERIES, cmsContentNetworksQuery]
      : LINK_BASE_QUERIES;
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
// Minimum branded-splash time on the first load so a warm cache doesn't make it
// blink in and straight back out.
const SPLASH_MIN_MS = 450;

function readSplashEligibility(): boolean {
  try {
    return !sessionStorage.getItem("splashShown");
  } catch {
    return true;
  }
}

// Fades out and removes the inline #boot loader from index.html. It is the
// zero-JS loading screen that covers the gap before this bundle executes.
function removeBootLoader() {
  const boot = document.getElementById("boot");
  if (!boot) return;
  boot.classList.add("is-hidden");
  window.setTimeout(() => boot.remove(), 220);
}

function AppWrapper() {
  // Branded splash is shown once per session. On later loads the inline #boot
  // loader stays up until critical data settles, so slow loads still get a
  // loading screen without repeating the full intro.
  const [splashEligible] = useState(readSplashEligibility);
  const [splashVisible, setSplashVisible] = useState(splashEligible);
  const [splashProgress, setSplashProgress] = useState(0);

  const reveal = useCallback(() => {
    if (splashEligible) {
      setSplashVisible(false);
    } else {
      removeBootLoader();
    }
  }, [splashEligible]);

  useEffect(() => {
    // Mark as seen immediately so a reload later in the session reads it.
    try {
      sessionStorage.setItem("splashShown", "true");
    } catch {
      // ignore storage failures (private mode, etc.)
    }

    const queries = criticalQueriesFor(window.location);
    let cancelled = false;
    let settled = 0;
    let revealed = false;

    const finish = () => {
      if (revealed || cancelled) return;
      revealed = true;
      reveal();
    };

    // First load: the branded splash replaces #boot right away (identical
    // black background, so the hand-off is invisible).
    if (splashEligible) {
      requestAnimationFrame(removeBootLoader);
    }

    if (queries.length === 0) {
      finish();
      return () => {
        cancelled = true;
      };
    }

    const capTimer = window.setTimeout(finish, SPLASH_MAX_MS);

    queries.forEach((query) => {
      queryClient
        .prefetchQuery(query as Parameters<QueryClient["prefetchQuery"]>[0])
        .catch(() => {})
        .finally(() => {
          if (cancelled) return;
          settled += 1;
          setSplashProgress(settled / queries.length);
          if (settled < queries.length) return;
          // All critical data is in. Hold the branded splash for a beat so it
          // doesn't flash; on later loads just drop #boot immediately.
          if (splashEligible) {
            window.setTimeout(finish, SPLASH_MIN_MS);
          } else {
            finish();
          }
        });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(capTimer);
    };
  }, [reveal, splashEligible]);

  return (
    <QueryClientProvider client={queryClient}>
      {splashEligible && (
        <SplashScreen
          visible={splashVisible}
          progress={splashProgress}
          fadeOutMs={180}
          onHidden={() => setSplashVisible(false)}
        />
      )}
      <RouterProvider router={router} />
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
