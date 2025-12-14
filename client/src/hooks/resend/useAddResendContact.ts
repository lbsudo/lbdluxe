// useAddResendContact.ts
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const AddContactSchema = z.object({
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type AddContactInput = z.infer<typeof AddContactSchema>;

export function useAddResendContact(serverUrl: string) {
  return useMutation({
    mutationFn: async (input: AddContactInput) => {
      // Validate input
      const validated = AddContactSchema.parse(input);

      const res = await fetch(`${serverUrl}/api/resend/add-resend-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      return res.json();
    },
  });
}
