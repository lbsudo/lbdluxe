import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UploadProfileImageResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Uploads an image to profile-images bucket */
export function useUploadProfileImage(options?: {
  onSuccess?: (url: string) => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      // Use fetch for FormData uploads since hc has multipart issues, but keep hc client for consistency
      const res = await fetch(`${serverUrl}/supabase/upload-profile-image`, {
        method: 'POST',
        body: formData,
        // Browser will automatically set Content-Type: multipart/form-data with boundary
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to upload image')
      }

      const result = await res.json()
      return result as UploadProfileImageResponse
    },
    onSuccess: (data: any) => {
      // Refetch images list after upload
      queryClient.invalidateQueries({ queryKey: ['profile-images'] })
      toast.success('Profile image uploaded successfully')
      options?.onSuccess?.(data.url)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

