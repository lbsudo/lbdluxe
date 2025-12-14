import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  useAddResendContact,
  type AddContactInput,
} from "@/hooks/resend/useAddResendContact";

interface NewsletterSubmitProps {
  serverUrl: string;
}

export function NewsletterSubmit({ serverUrl }: NewsletterSubmitProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddContactInput>();

  const { mutate, isPending } = useAddResendContact(serverUrl);

  const onSubmit = (values: AddContactInput) => {
    mutate(values, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success("Successfully subscribed!");
          reset();
        } else {
          toast.error(res.error ?? "Something went wrong.");
        }
      },
      onError: () => {
        toast.error("Failed to subscribe. Please try again.");
      },
    });
  };

  return (
    <Card className="mx-2 flex w-full items-center rounded-xl justify-center border border-neutral-500 p-2 md:mx-0 md:w-2/3 ">
      <Card className="flex w-full items-center justify-center rounded-lg bg-background py-6 px-6 gap-2">
        <p className="text-3xl font-semibold w-full text-center ">
          Subscribe to Newsletter
        </p>

        <p className="px-2 mb-2 text-center text-xl">
          A newsletter for entrepreneurs, developers, and lifelong learners.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full"
        >
          <Input
            className="border-foreground/75"
            placeholder="First Name"
            {...register("firstName")}
          />

          <Input
            className="border-foreground/75"
            placeholder="Last Name"
            {...register("lastName")}
          />

          <Input
            className="border-foreground/75"
            placeholder="name@example.com"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
          )}

          <Button
            type="submit"
            variant="bar"
            className="w-full bg-primary text-primary-foreground"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      </Card>
    </Card>
  );
}
