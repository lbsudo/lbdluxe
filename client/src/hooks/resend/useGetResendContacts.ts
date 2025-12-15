import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

/* ----------------------------------------
   Zod Schemas (mirror server response)
---------------------------------------- */

const ResendContactSchema = z.object({
  id: z.string(),
  email: z.email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  unsubscribed: z.boolean(),
  created_at: z.string(),
});

const GetResendContactsSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    data: z.array(ResendContactSchema),
  }),
});

const GetResendContactsErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const GetResendContactsResponseSchema = z.union([
  GetResendContactsSuccessSchema,
  GetResendContactsErrorSchema,
]);

/* ----------------------------------------
   Inferred Types
---------------------------------------- */

export type ResendContact = z.infer<typeof ResendContactSchema>;

/* ----------------------------------------
   Fetcher
---------------------------------------- */

async function fetchResendContacts(
  serverUrl: string,
): Promise<ResendContact[]> {
  const res = await fetch(`${serverUrl}/api/resend/get-resend-contacts`);

  if (!res.ok) {
    throw new Error("Failed to fetch newsletter subscribers");
  }

  const json = GetResendContactsResponseSchema.parse(await res.json());

  if (!json.success) {
    throw new Error(json.error);
  }

  return json.data.data;
}

/* ----------------------------------------
   TanStack Query Hook
---------------------------------------- */

export function useGetResendContacts(serverUrl: string) {
  return useQuery({
    queryKey: ["get-resend-contacts"],
    queryFn: () => fetchResendContacts(serverUrl),
    staleTime: 60_000, // 1 minute
  });
}
