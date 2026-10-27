import type { CMSBusinessCardPaymentLink } from "shared"

export const PAYMENT_BRAND_COLOR: Record<string, string> = {
  cashapp: "#00D632",
  paypal: "#003087",
  venmo: "#008CFF",
  skype: "#00AFF0",
}

export const PAYMENT_DEFAULT_LABEL: Record<string, string> = {
  cashapp: "Pay me via Cash App",
  paypal: "Pay me via PayPal",
  venmo: "Pay me via Venmo",
  skype: "Skype",
}

export const PAYMENT_DEFAULT_VALUE_LABEL: Record<string, string> = {
  cashapp: "Cash App",
  paypal: "PayPal",
  venmo: "Venmo",
  skype: "Skype",
}

/**
 * Normalize a CMS payment-link entry into a tappable row.
 * - If the value is a full URL, use it verbatim.
 * - Otherwise derive a provider URL from the handle/cashtag.
 */
export function resolvePaymentLink(pl: CMSBusinessCardPaymentLink): {
  type: string
  value: string
  href: string
  label: string
  color: string
  iconName: string
} {
  const type = pl.type || "cashapp"
  const value = (pl.value || "").trim()
  const isUrl = /^https?:\/\//i.test(value)

  let href = (pl.url || "").trim()
  if (!href) {
    if (isUrl) {
      href = value
    } else {
      switch (type) {
        case "cashapp": {
          const tag = value.replace(/^\$+/, "")
          href = `https://cash.app/$${tag}`
          break
        }
        case "paypal": {
          href = `https://paypal.me/${value}`
          break
        }
        case "venmo": {
          href = `https://venmo.com/${value}`
          break
        }
        case "skype": {
          href = `skype:${value}`
          break
        }
        default:
          href = value
      }
    }
  }

  return {
    type,
    value: value.startsWith("$") ? value : (type === "cashapp" ? `$${value}` : value),
    href,
    label: pl.label || PAYMENT_DEFAULT_LABEL[type] || "Link",
    color: PAYMENT_BRAND_COLOR[type] || "#6366f1",
    iconName: type === "cashapp" ? "SiCashapp" : type === "paypal" ? "SiPaypal" : type === "venmo" ? "SiVenmo" : type === "skype" ? "SiSkype" : "Link",
  }
}

export function buildPaymentRows(card: { paymentLinks?: CMSBusinessCardPaymentLink[] | null }): ReturnType<typeof resolvePaymentLink>[] {
  const list = (card.paymentLinks || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return list.filter((p) => p.value).map(resolvePaymentLink)
}
