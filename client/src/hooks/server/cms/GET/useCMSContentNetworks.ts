import type { CMSContentNetwork } from "shared"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export type NetworkType = "youtube" | "rumble"

export const cmsContentNetworksQuery: UseQueryOptions<CMSContentNetwork[]> = {
  queryKey: ["cms", "content-network"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/content-network`)
    if (!res.ok) throw new Error("Failed to fetch content networks")
    return (await res.json()) as CMSContentNetwork[]
  },
  staleTime: 1000 * 60 * 5,
}

export function useCMSContentNetworks() {
  return useQuery(cmsContentNetworksQuery)
}