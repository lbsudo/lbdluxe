import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { CMSBusinessCard } from "shared";
import { cacheOffline } from "@/lib/pwa";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787";

/** Where the last-seen card is kept so the card still opens with no signal. */
const CACHE_KEY = "card.cache.v1";

function readCachedCard(): CMSBusinessCard | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CMSBusinessCard | null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeCachedCard(card: CMSBusinessCard | null) {
  try {
    if (card) {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(card));
    } else {
      window.localStorage.removeItem(CACHE_KEY);
    }
  } catch {
    // Private browsing and full quotas both throw here. The card still works,
    // it just won't survive a reload with no network.
  }
}

// Read once, at boot. The value is only used as a seed for the query.
const seededCard = typeof window !== "undefined" ? readCachedCard() : null;

export const cmsBusinessCardQuery: UseQueryOptions<CMSBusinessCard | null> = {
  queryKey: ["cms", "business-card"],
  /**
   * "always" keeps the request running when the device is offline. React
   * Query's default ("online") pauses the query instead — the card would sit
   * on "Loading…" forever with no network, which is exactly the moment the
   * card matters most.
   */
  networkMode: "always",
  /**
   * The last card this device saw. It paints instantly, and stays put if the
   * refresh fails — the service worker answers from its cache when it can,
   * and this is the second line of defence when it can't.
   */
  initialData: seededCard ?? undefined,
  initialDataUpdatedAt: 0,
  queryFn: async () => {
    const url = `${serverUrl}/cms/business-card`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch CMS business card");
    }
    const card = (await res.json()) as CMSBusinessCard | null;
    writeCachedCard(card);
    // The service worker may not have been controlling the page when this
    // request went out, so hand it the payload directly.
    cacheOffline(url, card);
    return card;
  },
};

export function useCMSBusinessCard() {
  return useQuery(cmsBusinessCardQuery);
}
