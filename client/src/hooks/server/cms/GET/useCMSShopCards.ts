import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { CMSShopCard } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export const cmsShopCardsQuery: UseQueryOptions<CMSShopCard[]> = {
  queryKey: ["cms", "shop-cards"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/shop-cards`)
    if (!res.ok) {
      throw new Error("Failed to fetch CMS shop cards")
    }
    return (await res.json()) as CMSShopCard[]
  },
}

export function useCMSShopCards() {
  return useQuery(cmsShopCardsQuery)
}
