import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useAddWaitlistContact,
  type AddWaitlistInput,
} from "@/hooks/server/resend/POST/useAddWaitlistContact"

interface WaitlistFormProps {
  /** Product type or slug stored alongside the signup so you know what they want. */
  interest?: string
  /** Shown above the input. */
  label?: string
  className?: string
}

/**
 * "Notify me" capture for products that aren't on sale yet. Signups land in the
 * Resend audience (see the /resend/add-waitlist-contact endpoint).
 */
export function WaitlistForm({ interest, label, className }: WaitlistFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddWaitlistInput>({ defaultValues: { interest } })
  const { mutate, isPending } = useAddWaitlistContact()

  const onSubmit = (values: AddWaitlistInput) => {
    mutate(
      { ...values, interest },
      {
        onSuccess: () => {
          toast.success("You're on the list — we'll email you when it's live.")
          reset({ email: "", firstName: "", interest })
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Something went wrong.")
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {label && <p className="mb-2 text-xs text-muted-foreground">{label}</p>}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-label="Email address"
          {...register("email", {
            required: "An email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
          })}
        />
        <Button type="submit" disabled={isPending} className="shrink-0">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Notify me"}
        </Button>
      </div>
      {errors.email && (
        <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
      )}
    </form>
  )
}
