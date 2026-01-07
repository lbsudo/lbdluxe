import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateProductResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Creates a new product */
export function useCreateProduct(options?: {
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
      const res = await fetch(`${serverUrl}/supabase/products/create-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to create product')
      }
      return (await res.json()) as CreateProductResponse
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