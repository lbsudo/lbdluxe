import type { CMSMedia } from "shared"

interface Props {
  href: string
  title: string
  iconType?: "auto" | "custom" | null
  icon?: CMSMedia | null
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return ""
  }
}

export default function SocialLink({ href, title, iconType, icon }: Props) {
  const imgSrc =
    iconType === "custom" && icon?.url
      ? icon.url
      : getFaviconUrl(href)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      className="flex items-center justify-center rounded-full bg-white p-2 hover:opacity-80 transition-opacity"
    >
      {imgSrc ? (
        <img src={imgSrc} alt={title} className="h-6 w-6" />
      ) : (
        <span className="h-6 w-6 flex items-center justify-center text-xs text-gray-500">
          ?
        </span>
      )}
    </a>
  )
}
