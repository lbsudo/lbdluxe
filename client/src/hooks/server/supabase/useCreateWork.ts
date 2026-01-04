import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hcWithType } from 'server/client'
import type { CreateWorkResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'
const client = hcWithType(serverUrl) as any;

/** Creates a new work */
export function useCreateWork(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      name: string
      description: string
      project_link?: string
      directory?: boolean
      beta?: boolean
      icon_image_url?: string
      image_urls?: string[]
    }) => {
      const res = await (client.supabase as any)['create-work'].$post({ json: payload })
      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to create work')
      }
      return (await res.json()) as CreateWorkResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}