import { useMutation } from '@tanstack/react-query'
import type { UploadBlogImageResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Uploads an image for blog posts */
export function useUploadBlogImage(options?: {
  onSuccess?: (data: UploadBlogImageResponse) => void
  onError?: (error: Error) => void
}) {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${serverUrl}/supabase/upload-blog-image`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to upload image')
      }

      const result = await res.json()
      return result as UploadBlogImageResponse
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}