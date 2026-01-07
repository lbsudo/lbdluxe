import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hcWithType } from 'server/client';
import { toast } from 'sonner';
import type { DeleteProfileImageResponse } from 'shared';

// Server URL configuration – falls back to localhost in dev
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787';
// Initialise typed client (cast to any to avoid generic‑mismatch warnings)
const api = hcWithType(serverUrl) as any;

export function useDeleteProfileImage(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filename: string) => {
      // DELETE /supabase/delete-profile-image/:filename
      const res = await (api.supabase as any)['profile/delete-profile-image'][':filename'].$delete({
        param: { filename },
      });

      if (!res.ok) {
        // Try to surface a useful error message from the response body
        try {
          const json = await res.json();
          throw new Error(json.error ?? 'Failed to delete image');
        } catch {
          const txt = await res.text();
          throw new Error(txt || 'Failed to delete image');
        }
      }

      // Success payload matches the shared type
      return { success: true } as DeleteProfileImageResponse;
    },
    onSuccess: () => {
      // Invalidate the images query so the UI refreshes
      queryClient.invalidateQueries({ queryKey: ['profile-images'] });
      toast.success('Profile image deleted successfully');
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
