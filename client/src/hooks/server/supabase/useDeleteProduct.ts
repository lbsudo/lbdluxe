import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DeleteProductResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Deletes a product and all its associated images */
export function useDeleteProduct(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${serverUrl}/supabase/delete-product`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to delete product')
      }

      const result = await res.json()
      return result as DeleteProductResponse
    },
    onSuccess: () => {
      // Refetch the products list after deletion
      queryClient.invalidateQueries({ queryKey: ['products'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}