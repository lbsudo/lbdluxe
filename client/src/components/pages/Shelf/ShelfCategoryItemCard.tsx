import React from "react"
import type { CMSShelfItem } from "shared"
import { Link } from "@tanstack/react-router"
import { BookOpen, Clapperboard, Monitor, DiscAlbum, Star } from "lucide-react"

interface ShelfCategoryItemCardProps {
  item: CMSShelfItem
}

const catIconMap: Record<string, { icon: React.ReactNode; label: string }> = {
  Book:    { icon: <BookOpen size={14} />,      label: "Book" },
  Movie:   { icon: <Clapperboard size={14} />,   label: "Movie" },
  "TV Show": { icon: <Monitor size={14} />,      label: "TV Show" },
  Series:  { icon: <Monitor size={14} />,        label: "Series" },
  Album:   { icon: <DiscAlbum size={14} />,      label: "Album" },
  Music:   { icon: <DiscAlbum size={14} />,      label: "Music" },
}

export const ShelfCategoryItemCard: React.FC<ShelfCategoryItemCardProps> = ({ item }) => {
  const mediaCategory = item.shelfCategories?.[0]
  const typeInfo = mediaCategory ? catIconMap[mediaCategory.title] : null
  const typeIcon = typeInfo?.icon ?? <BookOpen size={14} />
  const typeLabel = typeInfo?.label ?? "Item"
  const authorNames = item.authors?.map((a) => a.title).join(", ")

  return (
    <Link
      to={"/shelf-items/$slug"}
      params={{ slug: item.slug ?? String(item.id) }}
      className="flex gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="w-16 shrink-0 aspect-[2/3] rounded overflow-hidden bg-muted">
        {item.coverImage?.url ? (
          <img
            src={item.coverImage.url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {typeIcon}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
        <h3 className="font-semibold text-sm leading-tight truncate">{item.title}</h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            {typeIcon}
            {typeLabel}
          </span>
          {item.rating != null && (
            <span className="inline-flex items-center gap-0.5">
              <Star size={10} className="fill-yellow-500 text-yellow-500" />
              {item.rating}/10
            </span>
          )}
        </div>

        {authorNames && (
          <p className="text-xs text-muted-foreground truncate">
            by {authorNames}
          </p>
        )}

        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  )
}
