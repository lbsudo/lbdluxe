import { useMutation } from '@tanstack/react-query'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Moves a cover image when blog title changes */
export function useMoveBlogCoverImage(options?: {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}) {
  return useMutation({
    mutationFn: async ({ currentCoverImageUrl, newTitle }: { 
      currentCoverImageUrl: string; 
      newTitle: string 
    }) => {
      const res = await fetch(`${serverUrl}/supabase/blog/move-blog-cover-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentCoverImageUrl,
          newTitle,
        }),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to move cover image')
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