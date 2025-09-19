import beaver from "@/assets/beaver.svg";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {hcWithType} from "server/dist/client";

// const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000
export const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";

const client = hcWithType(SERVER_URL);

type ResponseType = Awaited<ReturnType<typeof client.api.hello.$get>>;

export const HomeHero = () => {
    const [data, setData] = useState<
        Awaited<ReturnType<ResponseType["json"]>> | undefined
    >();

    const {mutate: sendRequest} = useMutation({
        mutationFn: async () => {
            try {
                const res = await client.api.hello.$get();
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
        <>
            <div className={'w-full h-auto flex flex-col items-center justify-center gap-4'}>

                <a
                    href="https://github.com/stevedylandev/bhvr"
                    target="_blank"
                    rel="noopener"
                >
                    <img
                        src={beaver}
                        className="w-16 h-16 cursor-pointer"
                        alt="beaver logo"
                    />
                </a>
                <h1 className="text-5xl font-black">bhvr</h1>
                <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
                <p>A typesafe fullstack monorepo</p>
                <div className="flex items-center gap-4">
                    <Button onClick={() => sendRequest()}>Call API</Button>
                    <Button variant="secondary" asChild>
                        <a target="_blank" href="https://bhvr.dev" rel="noopener">
                            Docs
                        </a>
                    </Button>
                </div>
                {data && (
                    <pre className="bg-neutral-800 p-4 rounded-md">
					<code>
						Message: {data.message} <br/>
						Success: {data.success.toString()}
					</code>
				</pre>
                )}
            </div>
        </>
    )
}