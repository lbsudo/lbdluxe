import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DeleteWorkResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Deletes a work and all its associated images */
export function useDeleteWork(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${serverUrl}/supabase/delete-work`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to delete work')
      }

      const result = await res.json()
      return result as DeleteWorkResponse
    },
    onSuccess: () => {
      // Refetch the works list after deletion
      queryClient.invalidateQueries({ queryKey: ['works'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}