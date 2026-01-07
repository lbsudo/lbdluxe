import { useQuery } from '@tanstack/react-query'
import { hcWithType } from 'server/client'

const isProd = import.meta.env.PROD
const SERVER_URL = isProd
  ? import.meta.env.VITE_SERVER_URL
  : 'http://localhost:8787'

const client = hcWithType(`${SERVER_URL}/resend`) as any

export function useSegments() {
  return useQuery({
    queryKey: ['resend-segments'],
    queryFn: async () => {
      const response = await client.segments.$get({})
      
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        console.error('Segments API returned non-JSON response:', text)
        throw new Error(`API returned non-JSON response: ${text.substring(0, 100)}`)
      }

      const json = await response.json()

      const segments = (json as any)?.segments || []

      return segments
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('non-JSON')) return false
      if (error?.message?.includes('status 5')) return failureCount < 1
      return false
    },
  })
}