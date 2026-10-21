import { useCMSBusinessCard } from "@/hooks/server/cms/GET/useCMSBusinessCard"
import { CardHero } from "./card-hero"
import { ContactActions } from "./contact-actions"
import { CardSocialLinks } from "./card-social-links"
import { CardQr } from "./card-qr"
import { CARD_BRAND } from "./theme"

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

  return (
    <article className="flex flex-col items-center gap-6">
      <CardHero card={card} accent={CARD_BRAND} />
      <ContactActions card={card} accent={CARD_BRAND} />
      <CardSocialLinks card={card} accent={CARD_BRAND} />
      <CardQr url={typeof window !== "undefined" ? window.location.href : "https://card.lbdluxe.com"} accent={CARD_BRAND} />
      <p className="text-xs text-white/30">LB DLUXE</p>
    </article>
  )
}
