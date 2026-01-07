import { useMutation } from '@tanstack/react-query'
import type { UploadWorkImageResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Uploads an image for a product */
export function useUploadProductImage(options?: {
  onSuccess?: (data: UploadWorkImageResponse) => void
  onError?: (error: Error) => void
}) {
  return useMutation({
    mutationFn: async (payload: {
      file: File
      productName: string
    }) => {
      const formData = new FormData()
      formData.append('file', payload.file)
      formData.append('productName', payload.productName)

      // Use fetch for FormData uploads since Hono client has multipart issues
      const res = await fetch(`${serverUrl}/supabase/products/upload-product-image`, {
        method: 'POST',
        body: formData,
        // Browser will automatically set Content-Type: multipart/form-data with boundary
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to upload image')
      }

      const result = await res.json()
      return result as UploadWorkImageResponse
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}