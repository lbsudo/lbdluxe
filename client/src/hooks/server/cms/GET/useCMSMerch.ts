import { useQuery, type UseQueryOptions } from "@tanstack/react-query"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export interface MerchOption {
  id: number
  label: string
  value: string
  variantType?: { id: number; name: string; label: string } | number | null
}

export interface MerchVariant {
  id: number
  product: number | { id: number }
  options: (number | MerchOption)[]
  priceInUSD?: number | null
  inventory?: number | null
}

export interface MerchProduct {
  id: number
  title: string
  slug?: string | null
  gallery?: { image?: { url?: string | null } | number | null }[] | null
}

export function variantOptionObjects(variant: MerchVariant): MerchOption[] {
  return variant.options.filter((o): o is MerchOption => typeof o === "object")
}

export function variantProductId(variant: MerchVariant): number {
  return typeof variant.product === "object" ? variant.product.id : variant.product
}

export function productImageUrl(product: MerchProduct): string | null {
  const first = product.gallery?.[0]?.image
  return first && typeof first === "object" && first.url ? first.url : null
}

export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export const cmsMerchProductsQuery: UseQueryOptions<MerchProduct[]> = {
  queryKey: ["cms", "merch-products"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/merch-products`)
    if (!res.ok) throw new Error("Failed to fetch merch products")
    return (await res.json()) as MerchProduct[]
  },
  staleTime: 1000 * 60 * 5,
}

export const cmsMerchVariantsQuery: UseQueryOptions<MerchVariant[]> = {
  queryKey: ["cms", "merch-variants"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/merch-variants`)
    if (!res.ok) throw new Error("Failed to fetch merch variants")
    return (await res.json()) as MerchVariant[]
  },
  staleTime: 1000 * 60 * 5,
}

export function useCMSMerchProducts() {
  return useQuery(cmsMerchProductsQuery)
}

export function useCMSMerchVariants() {
  return useQuery(cmsMerchVariantsQuery)
}
