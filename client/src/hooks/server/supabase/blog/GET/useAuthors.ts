import { useQuery } from '@tanstack/react-query'
import { hcWithType } from 'server/client'

const isProd = import.meta.env.PROD
const SERVER_URL = isProd
  ? import.meta.env.VITE_SERVER_URL
  : 'http://localhost:8787'

const supabaseClient = hcWithType(`${SERVER_URL}/supabase/blog`) as any

export function useAuthors() {
  return useQuery({
    queryKey: ['supabase-authors'],
    queryFn: async () => {
      const response = await supabaseClient.authors.$get({})
      const json = await response.json()

      const authors = (json as any)?.authors || []

      return authors
    },
    staleTime: 5 * 60 * 1000,
  })
}