import type { CMSFitnessProduct } from "shared"

import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export type FitnessProductType = CMSFitnessProduct["type"]

export function cmsFitnessProductsQuery(type?: FitnessProductType): UseQueryOptions<CMSFitnessProduct[]> {
  const query = type ? `?type=${encodeURIComponent(type)}` : ""
  return {
    queryKey: ["cms", "fitness-products", type ?? "all"],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/fitness-products${query}`)
      if (!res.ok) throw new Error("Failed to fetch fitness products")
      return (await res.json()) as CMSFitnessProduct[]
    },
    staleTime: 1000 * 60 * 5,
  }
}

export function useCMSFitnessProducts(type?: FitnessProductType) {
  return useQuery(cmsFitnessProductsQuery(type))
}

export function cmsFitnessProductQuery(slug: string): UseQueryOptions<CMSFitnessProduct | null> {
  return {
    queryKey: ["cms", "fitness-products", "slug", slug],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/fitness-products/${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error("Failed to fetch fitness product")
      return (await res.json()) as CMSFitnessProduct | null
    },
    enabled: !!slug,
  }
}

export function useCMSFitnessProduct(slug: string) {
  return useQuery(cmsFitnessProductQuery(slug))
}
