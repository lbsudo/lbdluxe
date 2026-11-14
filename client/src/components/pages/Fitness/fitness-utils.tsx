import { Calendar, Clock, Dumbbell, Pill } from "lucide-react"
import type { ReactNode } from "react"
import type { CMSFitnessProduct } from "shared"

import {
  program as foundationProgram,
  totalSessions as foundationSessionCount,
  weeks as foundationWeeks,
} from "@/content/programs/foundation-30/program"

export type FitnessType = CMSFitnessProduct["type"]

export interface FitnessTypeMeta {
  label: string
  singular: string
  tagline: string
  description: string
  icon: ReactNode
}

/** Order used for navigation and the landing tiles. */
export const FITNESS_TYPE_ORDER: FitnessType[] = ["program", "supplement"]

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

/* -------------------------------------------------------------- free program -- */

/**
 * The Foundation 30 is a free, gated download rather than a paid Polar
 * product, so it is defined in code instead of the CMS: no schema change, no
 * migration, and the copy is versioned alongside the PDF it generates.
 *
 * It is shaped like a CMS product so the same card and detail components can
 * render it as part of the catalog.
 */
export const FREE_PROGRAM_SLUG = foundationProgram.slug

export const FREE_PROGRAM_DOWNLOAD_PATH = "/programs/foundation-30-day-recomp.pdf"

export const FREE_PROGRAM_COVER_PATH = "/programs/foundation-30-day-recomp-cover.png"

export const FREE_PROGRAM_OG_PATH = "/programs/foundation-30-day-recomp-og.png"

export interface FreeProgram extends CMSFitnessProduct {
  /** Marks this as a gated free download rather than a purchasable product. */
  isFreeProgram: true
  /** The program slug, used to tag the contact and file the segment. */
  programSlug: string
  /** Where the PDF is served from. */
  downloadPath: string
}

export const freeProgram: FreeProgram = {
  id: -1,
  type: "program",
  title: `${foundationProgram.title} — ${foundationProgram.subtitle}`,
  slug: FREE_PROGRAM_SLUG,
  shortDescription:
    "A 30-day beginner calisthenics program for building muscle and losing fat at the same time. No equipment, no guesswork.",
  description: null,
  price: 0,
  currency: "USD",
  badge: "Free",
  featured: true,
  order: -1,
  coverImage: { url: FREE_PROGRAM_COVER_PATH },
  comingSoon: false,
  isFreeProgram: true,
  programSlug: FREE_PROGRAM_SLUG,
  downloadPath: FREE_PROGRAM_DOWNLOAD_PATH,
  // The free program is not a CMS document, so it has no database timestamps.
  // These exist only to satisfy the shared product shape.
  createdAt: "",
  updatedAt: "",
}

/**
 * Merges the free program into the catalog so it appears alongside the CMS
 * products. The CMS owns paid products; this owns the one free download.
 */
export function withFreeProgram(
  products: CMSFitnessProduct[] | undefined,
): CMSFitnessProduct[] {
  return [...(products ?? []), freeProgram]
}

/** True when the product is the gated free download. */
export function isFreeProgram(
  product: CMSFitnessProduct | FreeProgram,
): product is FreeProgram {
  return "isFreeProgram" in product && product.isFreeProgram === true
}

/** Headline facts for the gated landing page, taken from the program itself. */
export const freeProgramFacts = [
  { icon: Calendar, label: "Days", value: "30" },
  { icon: Dumbbell, label: "Per Week", value: "3x" },
  { icon: Pill, label: "Equipment", value: "0" },
  { icon: Clock, label: "Sessions", value: String(foundationSessionCount) },
]

/** A short, plain-language summary of what each training week is about. */
export const freeProgramWeeks = foundationWeeks.map((w) => ({
  week: w.week,
  title: w.title,
  focus: w.focus,
  intent: w.intent,
  days: w.trainingDays,
}))
