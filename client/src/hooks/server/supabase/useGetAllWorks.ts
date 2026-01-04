import { useQuery } from '@tanstack/react-query'
import { hcWithType } from 'server/client'
import type { GetAllWorksResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'
const client = hcWithType(serverUrl) as any;

/** Fetches all works */
export function useGetAllWorks() {
  return useQuery({
    queryKey: ['works'],
    queryFn: async () => {
      const res = await (client.supabase as any)['get-all-works'].$get()
      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to fetch works')
      }
      return (await res.json()) as GetAllWorksResponse
    },
  })
}