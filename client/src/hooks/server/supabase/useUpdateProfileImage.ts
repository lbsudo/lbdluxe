import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hcWithType } from 'server/client'
import type { UpdateProfileImageResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'
const client = hcWithType(serverUrl) as any;

/** Mutates the profile image URL */
export function useUpdateProfileImage(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { profile_image_url: string }) => {
      const res = await (client.supabase as any)['update-profile-image'].$post({
        json: payload
      })
      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to update profile image')
      }
      return (await res.json()) as UpdateProfileImageResponse
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
