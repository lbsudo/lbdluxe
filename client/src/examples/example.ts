import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { hcWithType } from "server/dist/client";
import { useMutation } from "@tanstack/react-query";
import DefaultLayout from "@/layouts/default.tsx";

export const Route = createFileRoute("/")({
    component: Index,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const client = hcWithType(SERVER_URL);

type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>;

function Index() {
    const [data, setData] = useState<
        Awaited<ReturnType<ResponseType["json"]>> | undefined
    >();

    const { mutate: sendRequest } = useMutation({
        mutationFn: async () => {
            try {
                const res = await client.hello.$get();
                if (!res.ok) {
                    console.log("Error fetching data");
                    return;
                }
                const data = await res.json();
                setData(data);
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <DefaultLayout>
            <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
        <div className="flex items-center gap-4">
        <Button onClick={() => sendRequest()}>Call API</Button>
    </div>
    {data && (
        <pre className="bg-primary-foreground text-primary p-4 radius-sm">
            <code>
                Message: {data.message} <br />
    Success: {data.success.toString()}
        </code>
        </pre>
    )}
    </div>
    </DefaultLayout>
);
}

export default Index;
