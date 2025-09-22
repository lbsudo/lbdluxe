import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {hcWithType} from "server/dist/client";

// const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000
export const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000" : "";

const client = hcWithType(SERVER_URL);

type ResponseType = Awaited<ReturnType<typeof client.api.hello.$get>>;
