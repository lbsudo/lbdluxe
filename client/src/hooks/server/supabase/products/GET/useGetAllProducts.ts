import { useQuery } from '@tanstack/react-query'
import type { GetAllProductsResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Fetches all products */
export function useGetAllProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/supabase/products/get-all-products`)
      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to fetch products')
      }
      return (await res.json()) as GetAllProductsResponse
    },
  })
}