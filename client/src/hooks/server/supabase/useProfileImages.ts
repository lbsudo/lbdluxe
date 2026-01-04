import { useQuery } from '@tanstack/react-query'
import { hcWithType } from 'server/client'

// ------------------------
// Server URL configuration
// ------------------------
const isProd = import.meta.env.PROD
const SERVER_URL = isProd
  ? import.meta.env.VITE_SERVER_URL
  : 'http://localhost:8787'

// Initialise typed client for Supabase routes
const client = hcWithType(`${SERVER_URL}/supabase`) as any

/** Fetches all profile image URLs from the Supabase bucket */
async function fetchProfileImages(): Promise<Array<string>> {
  const response = await client['get-profile-images'].$get({})
  if (!response.ok) {
    const err: any = await response.json()
    throw new Error(err.error ?? 'Failed to fetch profile images')
  }
  const json = (await response.json()) as {
    success: boolean
    images?: Array<string>
    error?: string
  }
  if (!json.success) throw new Error(json.error ?? 'Error fetching images')
  return json.images ?? []
}

export function useGetProfileImages() {
  return useQuery({
    queryKey: ['profile-images'],
    queryFn: fetchProfileImages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
