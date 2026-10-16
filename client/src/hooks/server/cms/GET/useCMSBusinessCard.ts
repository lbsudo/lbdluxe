import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { CMSBusinessCard } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export const cmsBusinessCardQuery: UseQueryOptions<CMSBusinessCard | null> = {
  queryKey: ["cms", "business-card"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/business-card`)
    if (!res.ok) {
      throw new Error("Failed to fetch CMS business card")
    }
    return (await res.json()) as CMSBusinessCard | null
  },
}

export function useCMSBusinessCard() {
  return useQuery(cmsBusinessCardQuery)
}