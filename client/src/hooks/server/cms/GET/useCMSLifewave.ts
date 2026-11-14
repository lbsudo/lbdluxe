import type { CMSLifewave, CMSLifewaveProduct } from "shared"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export const cmsLifewaveProductsQuery: UseQueryOptions<CMSLifewaveProduct[]> = {
  queryKey: ["cms", "lifewave-products"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/lifewave-products`)
    if (!res.ok) throw new Error("Failed to fetch LifeWave products")
    return (await res.json()) as CMSLifewaveProduct[]
  },
  staleTime: 1000 * 60 * 5,
}

export function useCMSLifewaveProducts() {
  return useQuery(cmsLifewaveProductsQuery)
}

export const cmsLifewaveQuery: UseQueryOptions<CMSLifewave> = {
  queryKey: ["cms", "lifewave"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/lifewave`)
    if (!res.ok) throw new Error("Failed to fetch LifeWave settings")
    return (await res.json()) as CMSLifewave
  },
  staleTime: 1000 * 60 * 5,
}

export function useCMSLifewave() {
  return useQuery(cmsLifewaveQuery)
}
