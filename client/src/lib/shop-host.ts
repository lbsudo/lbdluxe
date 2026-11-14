/**
 * Hosts allowed to render the shop. The shop is canonical on
 * shop.lbdluxe.com; the default Pages domain and its preview deployments
 * (*.lbdluxe.pages.dev) also render it so previews stay usable; local dev
 * hosts are allowed only in development builds.
 */
export function isShopHost(hostname: string): boolean {
  if (hostname === "shop.lbdluxe.com") return true;
  if (hostname === "lbdluxe.pages.dev" || hostname.endsWith(".lbdluxe.pages.dev")) {
    return true;
  }
  if (
    import.meta.env.DEV &&
    (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]")
  ) {
    return true;
  }
  return false;
}
