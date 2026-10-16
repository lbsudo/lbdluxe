import type { CMSBusinessCard } from "shared"
import { Phone, Mail, Globe, MapPin, Download, Share2 } from "lucide-react"
import { downloadVCard } from "@/lib/vcard"

interface Props {
  card: CMSBusinessCard
  accent: string
}

export function ContactActions({ card, accent }: Props) {
  const items: { label: string; icon: typeof Phone; href?: string; onClick?: () => void }[] = []
  if (card.phone) items.push({ label: "Call", icon: Phone, href: `tel:${card.phone}` })
  if (card.email) items.push({ label: "Email", icon: Mail, href: `mailto:${card.email}` })
  if (card.website) items.push({ label: "Website", icon: Globe, href: card.website })
  if (card.mapUrl || card.address) {
    items.push({
      label: "Directions",
      icon: MapPin,
      href: card.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(card.address || "")}`,
    })
  }
  items.push({ label: "Save Contact", icon: Download, onClick: () => downloadVCard(card) })

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
    <section className="grid w-full grid-cols-3 gap-3">
      {items.map((it) => {
        const Icon = it.icon
        const cls =
          "flex flex-col items-center justify-center gap-1 rounded-2xl bg-white/5 px-2 py-3 text-xs font-medium text-white ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95"
        if (it.href) {
          return (
            <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
              <Icon size={20} style={{ color: accent }} />
              {it.label}
            </a>
          )
        }
        return (
          <button key={it.label} type="button" onClick={it.onClick} className={cls}>
            <Icon size={20} style={{ color: accent }} />
            {it.label}
          </button>
        )
      })}
    </section>
  )
}
