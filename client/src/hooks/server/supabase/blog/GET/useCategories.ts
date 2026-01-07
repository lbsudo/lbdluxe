import { useQuery } from '@tanstack/react-query'
import { hcWithType } from 'server/client'

const isProd = import.meta.env.PROD
const SERVER_URL = isProd
  ? import.meta.env.VITE_SERVER_URL
  : 'http://localhost:8787'

const supabaseClient = hcWithType(`${SERVER_URL}/supabase/blog`) as any

export function useCategories() {
  return useQuery({
    queryKey: ['supabase-categories'],
    queryFn: async () => {
      const response = await supabaseClient.categories.$get({})
      const json = await response.json()

      const categories = (json as any)?.categories || []

      return categories.map((cat: any) => cat.name)
    },
    staleTime: 5 * 60 * 1000,
  })
}