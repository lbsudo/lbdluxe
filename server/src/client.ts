import { hc } from "hono/client";
import type { app } from "./index";

export type AppType = typeof app;
export type Client = ReturnType<typeof hc<AppType>>;

/**
 * Typed Hono client
 * Keeps generics intact across packages
 */
export function hcWithType(...args: Parameters<typeof hc>): Client {
  return hc<AppType>(...args);
}
