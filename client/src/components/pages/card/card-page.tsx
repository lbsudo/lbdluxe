"use client";

import { useCMSBusinessCard } from "@/hooks/server/cms/GET/useCMSBusinessCard"
import { CardHero } from "./card-hero"
import { ContactRows } from "./contact-rows"
import { CardQr } from "./card-qr"
import { CARD_BRAND } from "./theme"
import { downloadVCard } from "@/lib/vcard"
import { Save, Share2 } from "lucide-react"

export function CardPage() {
  const { data: card, isLoading } = useCMSBusinessCard()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-white/60">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="text-sm">Loading card…</p>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <h1 className="text-2xl font-bold">LB DLUXE</h1>
        <p className="text-sm text-white/60">Card not available yet.</p>
      </div>
    )
  }

  const accent = card.accentColor && card.accentColor !== "#ffffff" ? card.accentColor : CARD_BRAND

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: card!.name, text: card!.bio || card!.name, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <article className="flex flex-col items-center gap-6">
      <CardHero card={card} accent={accent} />
      <ContactRows card={card} accent={accent} />

      <div className="flex w-full flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => downloadVCard(card)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95"
          style={{ background: accent, boxShadow: `0 10px 30px -10px ${accent}` }}
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
          <CardQr url={typeof window !== "undefined" ? window.location.href : "https://card.lbdluxe.com"} accent={accent} />
        </div>
      </div>

      <p className="text-xs text-white/30">LB DLUXE</p>
    </article>
  )
}
