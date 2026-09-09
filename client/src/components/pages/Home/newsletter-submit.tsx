import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AddContactInput } from "@/hooks/server/resend/POST/useAddResendContact.ts";
import { Card } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAddResendContact } from "@/hooks/server/resend/POST/useAddResendContact.ts";
import { useCMSSite } from "@/hooks/server/cms/GET/useCMSSite.ts";

export function NewsletterSubmit() {
  const { data: site } = useCMSSite();
  const newsletter = site?.newsletter;

  const heading = newsletter?.heading?.trim() || "Subscribe to Newsletter";
  const subtitle =
    newsletter?.subtitle?.trim() ||
    "A newsletter for entrepreneurs, developers, and lifelong learners.";
  const placeholder = newsletter?.placeholder?.trim() || "name@example.com";
  const buttonLabel = newsletter?.buttonLabel?.trim() || "Subscribe";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddContactInput>();
  const { mutate, isPending } = useAddResendContact();

  const onSubmit = (values: AddContactInput) => {
    mutate(values, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success("Successfully subscribed!");
          reset();
        } else {
          // This should rarely happen if the API always returns success
          toast.error(res.error ?? "Something went wrong.");
        }
      },
      onError: () => {
        // Only network/unexpected errors trigger this
        toast.error("Failed to subscribe. Please try again.");
      },
    });
  };

  return (
    <Card className="mx-2 z-2 flex w-full items-center rounded-xl justify-center border dark:border-neutral-300/25 bg-transparent p-2 md:mx-0 md:w-2/3">
      <Card className="flex w-full items-center justify-center rounded-lg dark:bg-neutral-700/20 backdrop-blur-sm py-6 px-6 gap-2 ">
        <p className="text-3xl font-semibold w-full text-center">
          {heading}
        </p>

        <p className="px-2 mb-2 text-center text-xl">
          {subtitle}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full"
        >
          <Input
            placeholder="First Name"
            {...register("firstName")}
            className="border-foreground/75"
          />
          <Input
            placeholder="Last Name"
            {...register("lastName")}
            className="border-foreground/75"
          />
          <Input
            type="email"
            placeholder={placeholder}
            {...register("email", { required: "Email is required" })}
            className="border-foreground/75"
          />
          {errors.email && (
            <p className="text-red-400">{errors.email.message}</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            variant="bar"
            className="w-full bg-primary text-primary-foreground text-lg mt-4"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Subscribing...
              </>
            ) : (
              buttonLabel
            )}
          </Button>
        </form>
      </Card>
    </Card>
  );
}
