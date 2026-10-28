"use client";

import { useEffect, useRef, useState } from "react";
import { useCMSBusinessCard } from "@/hooks/server/cms/GET/useCMSBusinessCard";
import { CardHero } from "./card-hero";
import { ContactRows } from "./contact-rows";
import { CardQr } from "./card-qr";
import { InstallButton } from "./install-button";
import { CARD_BRAND } from "./theme";
import { downloadVCard } from "@/lib/vcard";
import { applyThemeColor } from "@/lib/seo";
import { onServiceWorkerUpdate } from "@/lib/pwa";
import { toast } from "sonner";
import { Save, Share2, QrCode } from "lucide-react";

export function CardPage() {
  const { data: card, isLoading, isError } = useCMSBusinessCard();
  const [qrOpen, setQrOpen] = useState(false);
  const pendingAction = useRef<string | null>(null);

  const accent =
    card?.accentColor && card.accentColor !== "#ffffff" ? card.accentColor : CARD_BRAND;

  // The manifest's shortcuts deep-link into the card with ?view=qr or
  // ?action=save. Read them once on mount, then strip them so a reload does
  // not replay the action.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    const action = params.get("action");
    if (view === "qr") setQrOpen(true);
    if (action) pendingAction.current = action;
    if (view || action) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname,
      );
    }
  }, []);

  // Saving needs the card data, so it waits until the record has loaded.
  useEffect(() => {
    if (!card || !pendingAction.current) return;
    if (pendingAction.current === "save") downloadVCard(card);
    pendingAction.current = null;
  }, [card]);

  // Match the browser chrome (status bar, title bar) to the card's accent.
  useEffect(() => {
    if (accent) applyThemeColor(accent);
  }, [accent]);

  // A new service worker has installed — offer to reload into it.
  useEffect(
    () =>
      onServiceWorkerUpdate(() => {
        toast("A new version of your card is ready", {
          description: "Reload to update.",
          action: {
            label: "Reload",
            onClick: () => window.location.reload(),
          },
          duration: 10000,
        });
      }),
    [],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-white/60">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="text-sm">Loading card…</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <h1 className="text-2xl font-bold">LB DLUXE</h1>
        <p className="text-sm text-white/60">
          {isError
            ? "Couldn't load this card. Check your connection and try again."
            : "Card not available yet."}
        </p>
      </div>
    );
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: card!.name,
          text: card!.bio || card!.name,
          url,
        });
      } catch {
        // Cancelled by the user.
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Card link copied");
    }
  }

  const cardUrl =
    typeof window !== "undefined"
      ? window.location.origin + "/card"
      : "https://card.lbdluxe.com/card";

  return (
    <article className="flex flex-col items-center gap-6">
      <CardHero card={card} accent={accent} />
      <ContactRows card={card} accent={accent} />

      <div className="flex w-full flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => downloadVCard(card)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95"
          style={{
            background: accent,
            boxShadow: `0 10px 30px -10px ${accent}`,
          }}
        >
          <Save size={20} />
          Save Contact
        </button>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={share}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10"
          >
            <Share2 size={16} /> Share
          </button>
          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10"
          >
            <QrCode size={16} /> QR Code
          </button>
        </div>

        <InstallButton />
      </div>

      <p className="text-xs text-white/30">LB DLUXE</p>

      <CardQr
        url={cardUrl}
        accent={accent}
        open={qrOpen}
        onClose={() => setQrOpen(false)}
      />
    </article>
  );
}
