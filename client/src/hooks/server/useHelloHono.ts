import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { hcWithType } from "server/client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
const client = hcWithType(SERVER_URL) as any;

type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>;

export function useHelloHono() {
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
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return { data, sendRequest };
}

