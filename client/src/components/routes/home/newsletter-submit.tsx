import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

interface NewsletterSubmitProps {
    serverUrl: string;
}

export function NewsletterSubmit({ serverUrl }: NewsletterSubmitProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    async function addContact(email: string) {
        if (!email) {
            toast.error("Please enter an email.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${serverUrl}/api/resend/add-resend-contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Subscribed successfully! 🎉");
                setEmail("");
            } else {
                toast.error(
                    `Error: ${data.error?.message || data.error || "Unknown error"}`
                );
            }
        } catch (err) {
            toast.error(`Error: ${(err as Error).message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
            <Card className="mx-4 flex w-full items-center rounded-xl justify-center border border-neutral-500 p-2 md:mx-0 md:w-1/2">
                <Card className="flex w-full items-center justify-center rounded-lg bg-neutral-950 py-6 px-6 gap-2">
                    <p className="text-3xl text-nowrap font-semibold w-full text-center">
                        Subscribe to Newsletter
                    </p>

                    <p className="text-neutral-300 px-2 mb-2 text-center text-xl">
                        A newsletter for entrepreneurs, developers, and those who want to
                        continuously learn.
                    </p>

                    <Input
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        type="button"
                        variant="bar"
                        className="w-full bg-white text-black"
                        onClick={() => addContact(email)}
                        disabled={loading}
                    >
                        {loading ? "Subscribing..." : "Subscribe"}
                    </Button>
                </Card>
            </Card>
    );
}
