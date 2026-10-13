import { Dumbbell, FlaskConical, Pill } from "lucide-react"
import type { ReactNode } from "react"
import type { CMSFitnessProduct } from "shared"

export type FitnessType = CMSFitnessProduct["type"]

export interface FitnessTypeMeta {
  label: string
  singular: string
  tagline: string
  description: string
  icon: ReactNode
}

/** Order used for navigation and the landing tiles. */
export const FITNESS_TYPE_ORDER: FitnessType[] = ["program", "supplement", "peptide"]

export const FITNESS_TYPE_META: Record<FitnessType, FitnessTypeMeta> = {
  program: {
    label: "Programs",
    singular: "Program",
    tagline: "Train with a plan",
    description:
      "Structured, progressive training programs delivered instantly as digital downloads.",
    icon: <Dumbbell className="size-6" />,
  },
  supplement: {
    label: "Supplements",
    singular: "Supplement",
    tagline: "Fuel the work",
    description:
      "Evidence-based supplements to support recovery, performance, and everyday health.",
    icon: <Pill className="size-6" />,
  },
  peptide: {
    label: "Peptides",
    singular: "Peptide",
    tagline: "Research-grade",
    description: "Research-grade peptides intended for laboratory research use only.",
    icon: <FlaskConical className="size-6" />,
  },
}

export function isFitnessType(value: string): value is FitnessType {
  return (FITNESS_TYPE_ORDER as string[]).includes(value)
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
}

export function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? ""
  return Number.isInteger(price) ? `${symbol}${price}` : `${symbol}${price.toFixed(2)}`
}

/**
 * A product can be bought only when it has a Polar checkout link and is not
 * explicitly flagged as coming soon. Everything else shows the waitlist.
 */
export function isPurchasable(
  product: Pick<CMSFitnessProduct, "polarCheckoutLink" | "comingSoon">,
): boolean {
  return Boolean(product.polarCheckoutLink) && !product.comingSoon
}
