import type { CMSBusinessCard } from "shared"

export function buildVCard(card: CMSBusinessCard): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"]
  if (card.name) {
    const parts = card.name.trim().split(/\s+/)
    const last = parts.length > 1 ? parts.pop() : ""
    const first = parts.join(" ")
    lines.push(`N:${last};${first};;;`)
    lines.push(`FN:${card.name}`)
  }
  if (card.company) lines.push(`ORG:${escape(card.company)}`)
  if (card.title) lines.push(`TITLE:${escape(card.title)}`)
  if (card.phone) lines.push(`TEL;TYPE=CELL,VOICE:${card.phone}`)
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET:${card.email}`)
  if (card.website) lines.push(`URL:${card.website}`)
  if (card.companyUrl) lines.push(`URL;type=work:${card.companyUrl}`)
  if (card.calendarUrl) lines.push(`URL;type=calendar:${card.calendarUrl}`)
  if (card.address) lines.push(`ADR;TYPE=WORK:;;${escape(card.address.replace(/\n/g, ", "))};;;;`)
  if (card.bio) lines.push(`NOTE:${escape(card.bio)}`)
  if (card.profileImage?.url) lines.push(`PHOTO;VALUE=URI:${card.profileImage.url}`)
  lines.push("END:VCARD")
  return lines.join("\r\n")
}

function escape(v: string): string {
  return v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
}

export function downloadVCard(card: CMSBusinessCard) {
  const vcf = buildVCard(card)
  const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${(card.name || "contact").replace(/\s+/g, "_")}.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
