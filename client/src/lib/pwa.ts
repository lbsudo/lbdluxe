/**
 * PWA plumbing for the card at card.lbdluxe.com.
 *
 * Everything here is inert on the other three hosts (lbdluxe.com,
 * links.lbdluxe.com, shop.lbdluxe.com): the service worker is only
 * registered for the card host, and the manifest is only linked from the
 * card route.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable";

/** The browser's own install prompt, held until the user asks for it. */
let deferredPrompt: BeforeInstallPromptEvent | null = null;

const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  // Chrome/Android/Edge fire this once the PWA looks installable. The default
  // action is the browser's mini-infobar; suppressing it lets the card show a
  // proper button instead.
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

/** Subscribes to install-prompt availability changes. */
export function subscribeToInstallPrompt(fn: () => void): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

/**
 * True when the card is running as an installed app (no browser chrome).
 */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    nav.standalone === true
  );
}

/**
 * iOS Safari never fires beforeinstallprompt — installation happens through
 * the Share sheet. iPadOS 13+ reports itself as a Mac, so it is detected by
 * its touch points rather than its user agent.
 */
export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return (
    /Macintosh/.test(ua) &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1
  );
}

/**
 * Whether an install affordance should be offered: either the browser gave us
 * a real prompt, or we're on iOS where the instruction sheet is the only
 * route.
 */
export function canInstall(): boolean {
  return deferredPrompt !== null || isIos();
}

/**
 * Fires the browser's install prompt. Only meaningful on platforms that
 * implement beforeinstallprompt.
 */
export async function promptInstall(): Promise<InstallOutcome> {
  if (!deferredPrompt) return "unavailable";
  const prompt = deferredPrompt;
  // The event can only be used once; drop it before awaiting so a second
  // click can't reuse a spent prompt.
  deferredPrompt = null;
  notify();
  try {
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    return outcome;
  } catch {
    return "dismissed";
  }
}

/**
 * Hands a payload to the service worker so it can be served offline.
 *
 * On the very first visit the worker is still installing and is not yet
 * controlling the page, so the request for this data never passes through it
 * and nothing ends up in the cache. Passing the payload across explicitly
 * means the first offline launch has something to show.
 */
export function cacheOffline(url: string, payload: unknown): void {
  if (typeof navigator === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const send = () => {
    navigator.serviceWorker.controller?.postMessage({
      type: "CACHE_CARD",
      url,
      card: payload,
    });
  };

  if (navigator.serviceWorker.controller) {
    send();
    return;
  }

  // The worker takes control a moment after it activates. Wait for that, but
  // never hold on to the payload forever.
  const timeout = window.setTimeout(() => {
    navigator.serviceWorker.removeEventListener("controllerchange", onChange);
  }, 10000);

  function onChange() {
    window.clearTimeout(timeout);
    navigator.serviceWorker.removeEventListener("controllerchange", onChange);
    send();
  }

  navigator.serviceWorker.addEventListener("controllerchange", onChange);
}

/* --------------------------------------------------------- service worker */

type UpdateCallback = () => void;

const updateCallbacks = new Set<UpdateCallback>();

/**
 * Called when a new service worker has installed and taken over. The page
 * keeps running the old bundle until it is reloaded.
 */
export function onServiceWorkerUpdate(fn: UpdateCallback): () => void {
  updateCallbacks.add(fn);
  return () => {
    updateCallbacks.delete(fn);
  };
}

function shouldRegisterServiceWorker(): boolean {
  const { hostname, pathname } = window.location;
  if (hostname === "card.lbdluxe.com") return true;
  // Local development: the card route still runs on localhost, so the worker
  // is allowed there too — otherwise the offline behaviour cannot be tested.
  // Scoped to the card path so the other routes on localhost stay untouched.
  return /^(localhost|127\.0\.0\.1)$/.test(hostname) && pathname.startsWith("/card");
}

/**
 * Registers the card's service worker.
 *
 * A service worker is scoped to its origin, so registering here only ever
 * affects card.lbdluxe.com — the other hosts never see it.
 */
export function registerCardServiceWorker(): void {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!shouldRegisterServiceWorker()) return;

  const register = () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((registration) => {
        // A worker that is already waiting means a newer build is ready.
        if (registration.waiting) {
          updateCallbacks.forEach((fn) => fn());
        }
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              updateCallbacks.forEach((fn) => fn());
            }
          });
        });
      })
      .catch(() => {
        // A failed registration must never break the card itself.
      });
  };

  // Registering on "load" keeps the worker off the critical path. If the
  // document has already finished loading, register straight away.
  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register, { once: true });
  }
}
