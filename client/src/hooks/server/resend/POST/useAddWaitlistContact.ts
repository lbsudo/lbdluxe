// client/hooks/resend/useAddWaitlistContact.ts
import { useMutation } from '@tanstack/react-query'
import { hcWithType, type Client } from "server/client"
import { z } from 'zod'

// Detect production
const isProd = import.meta.env.PROD

// Use absolute URL ONLY in production
const SERVER_URL = isProd
  ? import.meta.env.VITE_SERVER_URL
  : 'http://localhost:8787'

// Typed Hono client
const client: Client = hcWithType(`${SERVER_URL}/resend`)

// Runtime validation schema for API response
const addWaitlistResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      object: z.string(),
    })
    .optional(),
  error: z.string().optional(),
})

// Input type for the hook (audienceId handled by middleware). `interest` is the
// product type or slug the visitor wants to be notified about.
export type AddWaitlistInput = {
  email: string
  firstName?: string
  lastName?: string
  interest?: string
}

export function useAddWaitlistContact() {
  return useMutation({
    mutationFn: async (input: AddWaitlistInput) => {
      const res = await (client as any)['add-waitlist-contact'].$post({
        json: input,
      })

      const data = await res.json()
      const validated = addWaitlistResponseSchema.parse(data)

      if (!validated.success) {
        throw new Error(validated.error ?? 'Failed to join the waitlist')
      }

      return validated
    },
  })
}
