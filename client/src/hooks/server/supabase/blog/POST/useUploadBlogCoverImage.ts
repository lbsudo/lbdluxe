import { useMutation } from '@tanstack/react-query'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Uploads a cover image for blog posts */
export function useUploadBlogCoverImage(options?: {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}) {
  return useMutation({
    mutationFn: async ({ file, blogTitle }: { file: File; blogTitle: string }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('blogTitle', blogTitle)

      const res = await fetch(`${serverUrl}/supabase/blog/upload-blog-cover-image`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to upload cover image')
      }

      const result = await res.json()
      return result
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}