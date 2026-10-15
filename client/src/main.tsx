import { useEffect } from "react";
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
  cmsFitnessProductQuery,
  cmsFitnessProductsQuery,
  type FitnessProductType,
} from "@/hooks/server/cms/GET/useCMSFitnessProducts";
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

// The preloader feeds these into react-query's prefetchQuery. The hooks export
// fully-typed UseQueryOptions<T>; `object` keeps the heterogeneous list
// homogeneous without an `any` and the exact shape is restored at the call site.
type CriticalQuery = object;

const FITNESS_TYPES = ["program", "supplement", "peptide"];

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

  if (path === "/" && host !== "shop.lbdluxe.com") return [cmsSiteQuery, cmsPageQuery("home")];
  if (path === "/works") return [cmsSiteQuery, cmsPageQuery("works")];
  if (path === "/products")
    return [cmsSiteQuery, cmsPageQuery("products"), cmsDigitalProductsQuery];

  // The shop is its own site on shop.lbdluxe.com (the main host redirects
  // /fitness there), so its critical queries are prefetched only on the shop
  // host — plus local dev, where the fitness routes render on localhost.
  const shopPrefetch =
    host === "shop.lbdluxe.com" ||
    (import.meta.env.DEV && (path === "/fitness" || path.startsWith("/fitness/")));
  if (shopPrefetch) {
    if (path.startsWith("/fitness/")) {
      const rest = path.slice("/fitness/".length);
      const [type, slug] = rest.split("/");
      if (slug) return [cmsSiteQuery, cmsFitnessProductQuery(decodeURIComponent(slug))];
      if (FITNESS_TYPES.includes(type))
        return [cmsSiteQuery, cmsFitnessProductsQuery(type as FitnessProductType)];
    }
    return [cmsSiteQuery, cmsFitnessProductsQuery()];
  }

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
// leave the loader on screen forever. Queries usually settle well before this.
const BOOT_MAX_MS = 6000;
// Minimum time the loader stays up so a warm cache doesn't make it blink.
const BOOT_MIN_MS = 450;

// Feeds real progress into #boot's determinate bar (index.html).
function setBootProgress(p: number) {
  const boot = document.getElementById("boot");
  if (!boot) return;
  boot.setAttribute("data-progress", "true");
  boot.style.setProperty("--p", String(Math.min(1, Math.max(0, p))));
}

// Fades out and removes #boot. This is the loader's full lifecycle end.
function hideBoot() {
  const boot = document.getElementById("boot");
  if (!boot || boot.classList.contains("is-hidden")) return;
  boot.classList.add("is-hidden");
  window.setTimeout(() => boot.remove(), 240);
}

function AppWrapper() {
  // #boot (the single inline loader in index.html) is shown from first paint
  // until the page's critical queries settle. This effect only nudges its
  // progress bar and then hides it — nothing is re-rendered by React.
  useEffect(() => {
    const queries = criticalQueriesFor(window.location);
    const startedAt = performance.now();
    let cancelled = false;
    let settled = 0;
    let done = false;

    const finish = () => {
      if (done || cancelled) return;
      done = true;
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, BOOT_MIN_MS - elapsed);
      window.setTimeout(() => {
        if (!cancelled) hideBoot();
      }, wait);
    };

    if (queries.length === 0) {
      finish();
      return () => {
        cancelled = true;
      };
    }

    const capTimer = window.setTimeout(finish, BOOT_MAX_MS);

    queries.forEach((query) => {
      queryClient
        .prefetchQuery(query as Parameters<QueryClient["prefetchQuery"]>[0])
        .catch(() => {})
        .finally(() => {
          if (cancelled) return;
          settled += 1;
          setBootProgress(settled / queries.length);
          if (settled >= queries.length) {
            window.clearTimeout(capTimer);
            finish();
          }
        });
    });

    return () => {
      cancelled = true;
      window.clearTimeout(capTimer);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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