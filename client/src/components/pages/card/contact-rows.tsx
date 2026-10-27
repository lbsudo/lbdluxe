import type { CMSBusinessCard } from "shared"
import {
  Mail, Phone, Globe, MapPin, Building2, Calendar, Link as LinkIcon, Share2, CreditCard,
  Wallet, MessageCircle, Briefcase, FileText, Download, Camera, Music, Video, Star, Heart,
  ShoppingBag, DollarSign, GraduationCap, Award, Users, Play, Send, Printer, QrCode,
  MessageSquare, PhoneCall, Voicemail, AtSign, Home, Building, Clock, Contact, User,
  UserRound, MapPinned, CalendarDays, Map, Navigation, ExternalLink, Bookmark, Tag,
  Hash, Percent, Gift, Zap, Lock, Key, Shield, Bell, Flag, Pin, Paperclip, Folder, Image,
  Mic, Volume2, Headphones, Monitor, Smartphone, Tablet, Laptop, Watch, Wifi, Bluetooth,
  Battery, Power, Sun, Moon, Cloud, Coffee, Pizza, Utensils, Wine, Cake, Car, Bus, Train,
  Plane, Ship, Bike, Truck, Wrench, Hammer, Settings, Sliders, ToggleLeft, Check, Plus,
  Minus, ChevronRight, ArrowRight, ArrowUp, ArrowDown, ArrowLeft, RotateCw, RefreshCw,
  Repeat, Move, Copy, Clipboard, Scissors, Trash2, Edit, Pen, Pencil, Type, Bold, Italic,
  Underline, AlignLeft, AlignCenter, AlignRight, List, Grid, Layout, Layers, Box, Package,
  Archive, Inbox, MailOpen, MailCheck, MailPlus, Forward, Reply, ReplyAll,
} from "lucide-react"
import { siIconMap } from "@/components/icons"
import { getFaviconUrl, resolveSocialIcon } from "@/lib/resolve-social-icon"
import { buildPaymentRows } from "@/lib/payment-links"

const LUCIDE_MAP: Record<string, React.ComponentType<any>> = {
  Mail, Phone, Globe, MapPin, Building2, Calendar, Link: LinkIcon, Share2, CreditCard,
  Wallet, MessageCircle, Briefcase, FileText, Download, Camera, Music, Video, Star, Heart,
  ShoppingBag, DollarSign, GraduationCap, Award, Users, Play, Send, Printer, QrCode,
  MessageSquare, PhoneCall, Voicemail, AtSign, Home, Building, Clock, Contact, User,
  UserRound, MapPinned, CalendarDays, Map, Navigation, ExternalLink, Bookmark, Tag,
  Hash, Percent, Gift, Zap, Lock, Key, Shield, Bell, Flag, Pin, Paperclip, Folder, Image,
  Mic, Volume2, Headphones, Monitor, Smartphone, Tablet, Laptop, Watch, Wifi, Bluetooth,
  Battery, Power, Sun, Moon, Cloud, Coffee, Pizza, Utensils, Wine, Cake, Car, Bus, Train,
  Plane, Ship, Bike, Truck, Wrench, Hammer, Settings, Sliders, ToggleLeft, Check, Plus,
  Minus, ChevronRight, ArrowRight, ArrowUp, ArrowDown, ArrowLeft, RotateCw, RefreshCw,
  Repeat, Move, Copy, Clipboard, Scissors, Trash2, Edit, Pen, Pencil, Type, Bold, Italic,
  Underline, AlignLeft, AlignCenter, AlignRight, List, Grid, Layout, Layers, Box, Package,
  Archive, Inbox, MailOpen, MailCheck, MailPlus, Forward, Reply, ReplyAll,
}

const TYPE_DEFAULT_ICON: Record<string, string> = {
  email: "Mail",
  phone: "Phone",
  text: "MessageSquare",
  website: "Globe",
  company: "Building2",
  calendar: "Calendar",
  address: "MapPin",
  link: "Link",
  custom: "Link",
}

const TYPE_DEFAULT_LABEL: Record<string, string> = {
  email: "Email",
  phone: "Mobile",
  text: "Text",
  website: "Website",
  company: "Company",
  calendar: "Schedule a meeting",
  address: "Location",
}

interface Row {
  key: string
  iconNode: React.ReactNode
  iconBg?: string
  value: string
  label?: string | null
  href?: string | null
}

export function buildContactRows(card: CMSBusinessCard): Row[] {
  const rows: Row[] = []

  // Typed primary fields
  if (card.email) {
    rows.push({
      key: "email",
      iconNode: <Mail size={18} />,
      value: card.email,
      label: "Work email",
      href: `mailto:${card.email}`,
    })
  }
  if (card.phone) {
    rows.push({
      key: "phone",
      iconNode: <Phone size={18} />,
      value: card.phone,
      label: "Mobile",
      href: `tel:${card.phone}`,
    })
  }
  if (card.website) {
    rows.push({
      key: "website",
      iconNode: <Globe size={18} />,
      value: card.website,
      label: "Website",
      href: card.website,
    })
  }
  if (card.companyUrl) {
    rows.push({
      key: "company",
      iconNode: <Building2 size={18} />,
      value: card.companyUrl,
      label: "Company",
      href: card.companyUrl,
    })
  }
  if (card.calendarUrl) {
    rows.push({
      key: "calendar",
      iconNode: <Calendar size={18} />,
      value: card.calendarUrl,
      label: "Schedule a meeting",
      href: card.calendarUrl,
    })
  }
  if (card.address) {
    rows.push({
      key: "address",
      iconNode: <MapPin size={18} />,
      value: card.address,
      label: "Location",
      href: card.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(card.address)}`,
    })
  }

  // Social links (Blinq-style rows)
  for (const l of card.socialLinks || []) {
    const resolved = resolveSocialIcon(l.url)
    const Icon = l.iconType === "custom" && l.icon?.url ? null : siIconMap[resolved.iconName]
    const iconNode = l.iconType === "custom" && l.icon?.url ? (
      <img src={l.icon.url} alt="" className="h-5 w-5 rounded-full object-cover" />
    ) : Icon ? (
      <Icon className="h-5 w-5" />
    ) : (
      <img src={getFaviconUrl(l.url)} alt="" className="h-5 w-5 rounded-full object-cover" />
    )
    rows.push({
      key: `social-${l.id || l.url}`,
      iconNode,
      value: l.title,
      label: l.url,
      href: l.url,
    })
  }

  // Custom contact rows
  const custom = (card.contactRows || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  for (const r of custom) {
    const iconName = r.iconType === "custom" ? null : (r.type && TYPE_DEFAULT_ICON[r.type]) || "Link"
    const LucideIcon = r.iconType === "custom" && r.icon?.url ? null : LUCIDE_MAP[iconName as string]
    const iconNode =
      r.iconType === "custom" && r.icon?.url ? (
        <img src={r.icon.url} alt="" className="h-5 w-5 rounded-full object-cover" />
      ) : LucideIcon ? (
        <LucideIcon size={18} />
      ) : (
        <LinkIcon size={18} />
      )
    const href = r.url || (r.type === "email" ? `mailto:${r.value}` : r.type === "phone" || r.type === "text" ? `tel:${r.value}` : r.value)
    rows.push({
      key: `row-${r.id || r.value}`,
      iconNode,
      value: r.value,
      label: r.label || TYPE_DEFAULT_LABEL[r.type || "custom"] || null,
      href,
    })
  }

  // Payment links (Blinq-style brand-coloured rows)
  const paymentRows = buildPaymentRows(card)
  for (const p of paymentRows) {
    const Icon = siIconMap[p.iconName] || LUCIDE_MAP["Link"]
    rows.push({
      key: `payment-${p.type}-${p.value}`,
      iconNode: <Icon className="h-5 w-5" />,
      iconBg: p.color,
      value: p.value,
      label: p.label,
      href: p.href,
    })
  }

  return rows
}

interface Props {
  card: CMSBusinessCard
  accent: string
}

export function ContactRows({ card, accent }: Props) {
  const rows = buildContactRows(card)
  if (rows.length === 0) return null
  return (
    <section className="flex w-full flex-col gap-3">
      {rows.map((r) => (
        <a
          key={r.key}
          href={r.href || undefined}
          target={r.href?.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 transition hover:bg-white/10"
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ background: r.iconBg || accent }}
          >
            <span className="text-white">{r.iconNode}</span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{r.value}</p>
            {r.label && <p className="truncate text-xs text-white/50">{r.label}</p>}
          </div>
          {r.href?.startsWith("http") && <ChevronRight size={16} className="text-white/30" />}
        </a>
      ))}
    </section>
  )
}
