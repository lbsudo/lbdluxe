import type { CMSDigitalProduct } from "shared"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export const cmsDigitalProductsQuery: UseQueryOptions<CMSDigitalProduct[]> = {
  queryKey: ["cms", "digital-products"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/digital-products`)
    if (!res.ok) throw new Error("Failed to fetch digital products")
    return (await res.json()) as CMSDigitalProduct[]
  },
  staleTime: 1000 * 60 * 5,
}

export function useCMSDigitalProducts() {
  return useQuery(cmsDigitalProductsQuery)
}