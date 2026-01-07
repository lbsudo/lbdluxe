import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hcWithType } from 'server/client'
import type { UpdateProfileResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'
const client = hcWithType(serverUrl) as any;

/** Mutates the profile (description and words array) */
export function useUpdateProfile(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { description: string; words: string[] }) => {
      const res = await (client.supabase as any)['profile/update-profile'].$post({ json: payload })
      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to update profile')
      }
      return (await res.json()) as UpdateProfileResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}
