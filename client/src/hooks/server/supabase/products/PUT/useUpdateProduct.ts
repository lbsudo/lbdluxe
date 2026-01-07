import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateProductResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Updates a product */
export function useUpdateProduct(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      id: string
      name?: string
      description?: string
      project_link?: string
      directory?: boolean
      beta?: boolean
      icon_image_url?: string
      image_urls?: string[]
    }) => {
      const res = await fetch(`${serverUrl}/supabase/products/update-product`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to update product')
      }
      return (await res.json()) as UpdateProductResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}