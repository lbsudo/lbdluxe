import { useMutation } from '@tanstack/react-query'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Deletes a product image from storage */
export function useDeleteProductImage(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  return useMutation({
    mutationFn: async (filePath: string) => {
      const res = await fetch(`${serverUrl}/supabase/products/delete-product-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to delete image')
      }

      const result = await res.json()
      return result as { success: boolean }
    },
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}