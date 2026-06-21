import type { CMSContentNetwork } from "shared"

import { useQuery } from "@tanstack/react-query"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

type NetworkType = "youtube" | "rumble"

export function useCMSContentNetworks(networkType?: NetworkType) {
  return useQuery({
    queryKey: ["cms", "content-network", networkType],
    queryFn: async (): Promise<CMSContentNetwork[]> => {
      const res = await fetch(`${serverUrl}/cms/content-network`)
      if (!res.ok) throw new Error("Failed to fetch content networks")
      const allNetworks = (await res.json()) as CMSContentNetwork[]
      if (networkType) {
        return allNetworks.filter((n) => n.networkType === networkType)
      }
      return allNetworks
    },
    staleTime: 1000 * 60 * 5,
  })
}
