export interface CMSLink {
  type?: "reference" | "custom" | null
  newTab?: boolean | null
  url?: string | null
  label: string
  appearance?: "default" | "outline" | null
}

export interface CMSContentColumn {
  size: "oneThird" | "half" | "twoThirds" | "full"
  richText: string
  enableLink?: boolean
  link?: CMSLink | null
}

export interface CMSContentBlock {
  blockType: "content"
  columns: CMSContentColumn[]
}

export interface CMSCTALink {
  link: CMSLink
  id?: string | null
}

export interface CMSCTABlock {
  blockType: "cta"
  richText: string
  links?: CMSCTALink[] | null
}

export interface CMSProfileBlock {
  blockType: "profile"
  name: string
  words: { word: string; id?: string | null }[]
  description?: string | null
  profileImage?: CMSMedia | null
}

export interface CMSProductGridItem {
  id?: string | null
  name: string
  description: string
  projectLink?: string | null
  beta?: boolean | null
  iconImage?: CMSMedia | null
}

export interface CMSProductGridBlock {
  blockType: "productGrid"
  items: CMSProductGridItem[]
}

export interface CMSWorkGridItem {
  id?: string | null
  name: string
  description: string
  projectLink?: string | null
  repoLink?: string | null
  linkDisplay?: "both" | "website" | "repo" | null
  directory?: boolean | null
  beta?: boolean | null
  iconImage?: CMSMedia | null
  images?: { image: CMSMedia; id?: string | null }[] | null
}

export interface CMSWorkGridBlock {
  blockType: "workGrid"
  items: CMSWorkGridItem[]
}

export type CMSBlock = CMSContentBlock | CMSCTABlock | CMSProfileBlock | CMSProductGridBlock | CMSWorkGridBlock

export interface CMSMedia {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  focalPoint?: {
    x: number
    y: number
  } | null
}

export interface CMSPost {
  id: number
  title: string
  slug?: string | null
  heroImage?: CMSMedia | null
  content: string
  categories?: { id: number; title: string }[]
  authors?: { id: number; name: string }[]
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
  _status?: string | null
}

export interface CMSHero {
  type: "none" | "highImpact" | "mediumImpact" | "lowImpact"
  richText?: string | null
  links?: CMSCTALink[] | null
  media?: CMSMedia | null
}

export interface CMSMeta {
  title?: string | null
  description?: string | null
  image?: string | null
}

export interface CMSShelfCategory {
  id: number
  title: string
  slug?: string | null
}

export interface CMSShelfItemLink {
  label: string
  url: string
  id?: string | null
}

export interface CMSShelfAuthor {
  id: number
  title: string
}

export interface CMSShelfItem {
  id: number
  title: string
  slug?: string | null
  description?: string | null
  coverImage?: CMSMedia | null
  rating?: number | null
  review: string
  links?: CMSShelfItemLink[] | null
  shelfCategories?: CMSShelfCategory[] | null
  authors?: CMSShelfAuthor[] | null
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
  _status?: string | null
}

export interface CMSLinksProfile {
  id: number
  name: string
  handle?: string | null
  bio?: string | null
  profileImage?: CMSMedia | null
  socialLinks?: {
    title: string
    url: string
    iconType?: "auto" | "custom" | null
    icon?: CMSMedia | null
    id?: string | null
  }[] | null
}

export interface CMSBusinessCardSocial {
  title: string
  url: string
  platform?: "linkedin" | "twitter" | "instagram" | "facebook" | "youtube" | "tiktok" | "github" | "threads" | "other" | null
  iconType?: "auto" | "custom" | null
  icon?: CMSMedia | null
  id?: string | null
}

export interface CMSBusinessCardLogo {
  id?: string | null
  image?: CMSMedia | null
  alt?: string | null
  url?: string | null
  position?: "banner" | "below" | null
  order?: number | null
}

export interface CMSBusinessCardContactRow {
  id?: string | null
  type?: string | null
  label?: string | null
  value: string
  url?: string | null
  iconType?: "auto" | "custom" | null
  icon?: CMSMedia | null
  order?: number | null
}

export interface CMSBusinessCard {
  id: number
  name: string
  slug?: string | null
  title?: string | null
  department?: string | null
  headline?: string | null
  company?: string | null
  companyLogo?: CMSMedia | null
  logos?: CMSBusinessCardLogo[] | null
  bio?: string | null
  accreditations?: { name: string; id?: string | null }[] | null
  profileImage?: CMSMedia | null
  coverImage?: CMSMedia | null
  phone?: string | null
  email?: string | null
  website?: string | null
  companyUrl?: string | null
  calendarUrl?: string | null
  address?: string | null
  mapUrl?: string | null
  socialLinks?: CMSBusinessCardSocial[] | null
  contactRows?: CMSBusinessCardContactRow[] | null
  accentColor?: string | null
  updatedAt: string
  createdAt: string
  _status?: string | null
}

export interface CMSProfileLink {
  id: number
  title: string
  url: string
  linkType: "lg" | "sm"
  iconSet?: "si" | "sl" | "lucide" | null
  iconName?: string | null
  hexColor?: string | null
  coverImage?: CMSMedia | null
  order?: number | null
}

export interface CMSContentNetwork {
  id: number
  title: string
  url: string
  hexColor?: string | null
  networkType: "youtube" | "rumble"
  order?: number | null
}

export interface CMSDigitalProduct {
  id: number
  title: string
  slug?: string | null
  shortDescription?: string | null
  description?: string | null
  coverImage?: CMSMedia | null
  gallery?: CMSMedia[] | null
  price: number
  currency: string
  polarCheckoutLink: string
  badge?: string | null
  featured?: boolean | null
  order?: number | null
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
  _status?: string | null
}

export interface CMSFitnessProduct {
  id: number
  title: string
  slug?: string | null
  type: "program" | "supplement" | "peptide"
  shortDescription?: string | null
  description?: string | null
  coverImage?: CMSMedia | null
  gallery?: { image: CMSMedia; id?: string | null }[] | null
  price: number
  currency: string
  polarCheckoutLink?: string | null
  comingSoon?: boolean | null
  badge?: string | null
  featured?: boolean | null
  order?: number | null
  ageRestricted?: boolean | null
  /** Comma-separated region codes, e.g. "US, CA". */
  availableRegions?: string | null
  shippingNote?: string | null
  disclaimer?: string | null
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
  _status?: string | null
}

export interface CMSSite {
  siteName: string
  defaultTitle?: string | null
  defaultDescription?: string | null
  siteUrl?: string | null
  linksUrl?: string | null
  cardUrl?: string | null
  ogImage?: CMSMedia | null
  themeColor?: string | null
  newsletter?: {
    heading?: string | null
    subtitle?: string | null
    placeholder?: string | null
    buttonLabel?: string | null
    id?: string | null
  } | null
  socials?: {
    title: string
    url: string
    id?: string | null
  }[] | null
  updatedAt: string
  createdAt: string
}

export interface CMSPage {
  id: number
  title: string
  slug?: string | null
  hero?: CMSHero | null
  layout: CMSBlock[]
  meta?: CMSMeta | null
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
}
