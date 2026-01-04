// client/src/server_hooks/supabase/useGetProfile.ts
import { useQuery } from '@tanstack/react-query'
import { hcWithType } from 'server/client'
import type { GetProfileResponse } from 'shared'

// Init client once per module
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

const api = hcWithType(serverUrl) as any;

async function fetchProfile() {
  // For kebab-case routes, we need to use type assertion
  const res = await (api.supabase as any)['get-profile'].$get()

  if (!res.ok) throw new Error('Failed to fetch profile')

  const json = (await res.json()) as GetProfileResponse

  if (!json.success) throw new Error(json.error)

  return json.profile
}

export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60_000,
  })
}
