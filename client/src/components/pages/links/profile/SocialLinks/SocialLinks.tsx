import SocialLink from "./SocialLink"

interface Props {
  links?: {
    title: string
    url: string
    iconType?: "auto" | "custom" | null
    icon?: { url?: string | null } | null
    id?: string | null
  }[] | null
}

export default function SocialLinks({ links }: Props) {
  if (!links || links.length === 0) return null

  return (
    <div className="mt-2 flex flex-row items-center justify-center gap-2">
      {links.map((link) => (
        <SocialLink
          key={link.id ?? link.url}
          href={link.url}
          title={link.title}
          iconType={link.iconType}
          icon={link.icon}
        />
      ))}
    </div>
  )
}
