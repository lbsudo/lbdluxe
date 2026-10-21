import type { CMSBusinessCard } from "shared"
import { Phone, MessageSquare, Mail, Globe, Building2, Calendar, MapPin, Download, Share2 } from "lucide-react"
import { downloadVCard } from "@/lib/vcard"

interface Props {
  card: CMSBusinessCard
  accent: string
}

type Action = { label: string; icon: typeof Phone; href?: string; onClick?: () => void }

export function ContactActions({ card, accent }: Props) {
  const items: Action[] = []
  if (card.phone) items.push({ label: "Call", icon: Phone, href: `tel:${card.phone}` })
  if (card.phone) items.push({ label: "Text", icon: MessageSquare, href: `sms:${card.phone}` })
  if (card.email) items.push({ label: "Email", icon: Mail, href: `mailto:${card.email}` })
  if (card.website) items.push({ label: "Website", icon: Globe, href: card.website })
  if (card.companyUrl) items.push({ label: "Company", icon: Building2, href: card.companyUrl })
  if (card.calendarUrl) items.push({ label: "Calendar", icon: Calendar, href: card.calendarUrl })
  if (card.mapUrl || card.address) {
    items.push({
      label: "Directions",
      icon: MapPin,
      href: card.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(card.address || "")}`,
    })
  }

  async function share() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: card.name, text: card.bio || card.name, url })
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }
  items.push({ label: "Share", icon: Share2, onClick: share })

  return (
    <section className="flex w-full flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => downloadVCard(card)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95"
        style={{ background: accent, boxShadow: `0 10px 30px -10px ${accent}` }}
      >
        <Download size={20} />
        Save Contact
      </button>
      <div className="grid w-full grid-cols-4 gap-y-5">
        {items.map((it) => {
          const Icon = it.icon
          const circle =
            "flex h-14 w-14 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95"
          const content = (
            <>
              <span className={circle}>
                <Icon size={22} style={{ color: accent }} />
              </span>
              <span className="text-xs font-medium text-white/80">{it.label}</span>
            </>
          )
          const base = "flex flex-col items-center gap-2"
          if (it.href) {
            return (
              <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" className={base}>
                {content}
              </a>
            )
          }
          return (
            <button key={it.label} type="button" onClick={it.onClick} className={base}>
              {content}
            </button>
          )
        })}
      </div>
    </section>
  )
}
