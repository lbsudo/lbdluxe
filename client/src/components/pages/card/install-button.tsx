import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import {
  getInstallPrompt,
  isIos,
  isStandalone,
  promptInstall,
  subscribeToInstallPrompt,
} from "@/lib/pwa";

const DISMISSED_KEY = "card.install.dismissed";

/** How long the install button stays hidden after being waved away. */
const DISMISS_DAYS = 7;

function dismissedUntil(): number {
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    if (!raw) return 0;
    const until = Number(raw);
    return Number.isFinite(until) && until > Date.now() ? until : 0;
  } catch {
    return 0;
  }
}

function setDismissed() {
  try {
    window.localStorage.setItem(
      DISMISSED_KEY,
      String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000),
    );
  } catch {
    // Private browsing modes can refuse localStorage. Not worth failing over.
  }
}

/**
 * "Add to Home Screen" for the card.
 *
 * Chrome, Edge and Android get the browser's real install prompt. iOS Safari
 * has no such API, so the button opens a short instruction sheet instead.
 * Once the app is installed the button disappears on its own.
 */
export function InstallButton() {
  const [installed, setInstalled] = useState(true);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const sync = () => {
      setInstalled(isStandalone());
      setHasPrompt(getInstallPrompt() !== null);
      setHidden(dismissedUntil() > Date.now());
    };
    sync();
    return subscribeToInstallPrompt(sync);
  }, []);

  // A dismissal only lasts a while — the user may change their mind.
  useEffect(() => {
    if (hidden) return;
    const remaining = dismissedUntil() - Date.now();
    if (remaining <= 0) return;
    const timer = window.setTimeout(() => setHidden(false), remaining);
    return () => window.clearTimeout(timer);
  }, [hidden]);

  const showIOSHelp = isIos();
  const available = !installed && !hidden && (hasPrompt || showIOSHelp);
  if (!available && !showHelp) return null;

  async function onClick() {
    if (hasPrompt) {
      const outcome = await promptInstall();
      if (outcome === "accepted") setInstalled(true);
      return;
    }
    setShowHelp(true);
  }

  function closeHelp() {
    setShowHelp(false);
    setDismissed();
    setHidden(true);
  }

  return (
    <>
      {available && (
        <button
          type="button"
          onClick={onClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10"
        >
          <Download size={16} /> Add to Home Screen
        </button>
      )}

      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/95 px-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Add to Home Screen"
          onClick={closeHelp}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white/5 p-6 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">
                Add to Home Screen
              </h2>
              <button
                type="button"
                onClick={closeHelp}
                className="-m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <ol className="mt-5 flex flex-col gap-4 text-sm text-white/75">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                  1
                </span>
                <span>
                  Tap the <strong className="text-white">Share</strong> button
                  in Safari&apos;s toolbar — the square with an arrow pointing up.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                  2
                </span>
                <span>
                  Scroll down and tap{" "}
                  <strong className="text-white">Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                  3
                </span>
                <span>
                  Tap <strong className="text-white">Add</strong>. Your card
                  opens from the home screen with no browser bars.
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={closeHelp}
              className="mt-6 w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              style={{ background: "#6366f1" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
