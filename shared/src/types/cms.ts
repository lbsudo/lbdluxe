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

export type CMSBlock = CMSContentBlock | CMSCTABlock | CMSProfileBlock

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

export interface CMSWork {
  id: number
  name: string
  slug?: string | null
  description: string
  projectLink?: string | null
  repoLink?: string | null
  directory: boolean
  beta: boolean
  iconImage?: CMSMedia | null
  images?: { image: CMSMedia; id?: string | null }[] | null
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
  _status?: string | null
}

export interface CMSProduct {
  id: number
  name: string
  slug?: string | null
  description: string
  projectLink?: string | null
  directory: boolean
  beta: boolean
  iconImage?: CMSMedia | null
  images?: { image: CMSMedia; id?: string | null }[] | null
  publishedAt?: string | null
  updatedAt: string
  createdAt: string
  _status?: string | null
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
  tenant: number
  title: string
  url: string
  hexColor?: string | null
  networkType: "youtube" | "rumble"
  order?: number | null
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
