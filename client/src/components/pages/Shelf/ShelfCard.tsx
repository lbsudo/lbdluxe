import React from "react";
import type { CMSShelfItem } from "shared";
import { Link } from "@tanstack/react-router";
import { BookOpen, Clapperboard, Monitor, DiscAlbum, Star } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ShelfCardProps {
  item: CMSShelfItem;
}

const catIconMap: Record<string, { icon: React.ReactNode; label: string }> = {
  Book:    { icon: <BookOpen size={16} />,      label: "Book" },
  Movie:   { icon: <Clapperboard size={16} />,   label: "Movie" },
  "TV Show": { icon: <Monitor size={16} />,      label: "TV Show" },
  Series:  { icon: <Monitor size={16} />,        label: "Series" },
  Album:   { icon: <DiscAlbum size={16} />,      label: "Album" },
  Music:   { icon: <DiscAlbum size={16} />,      label: "Music" },
};

export const ShelfCard: React.FC<ShelfCardProps> = ({ item }) => {
  const mediaCategory = item.shelfCategories?.[0];
  const typeInfo = mediaCategory ? catIconMap[mediaCategory.title] : null;
  const typeIcon = typeInfo?.icon ?? <BookOpen size={16} />;
  const typeLabel = typeInfo?.label ?? "Item";

  const authorNames = item.authors?.map((a) => a.title).join(", ");

  return (
    <Link
      to={"/shelf-items/$slug"}
      params={{ slug: item.slug ?? String(item.id) }}
      className="group flex flex-col rounded-lg overflow-hidden bg-card border hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-muted">
        {item.coverImage?.url ? (
          <img
            src={item.coverImage.url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {typeIcon}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
        {authorNames && (
          <Tooltip>
            <TooltipTrigger className="text-xs text-muted-foreground truncate cursor-default">
              by {authorNames}
            </TooltipTrigger>
            <TooltipContent>
              {authorNames}
            </TooltipContent>
          </Tooltip>
        )}
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {typeIcon}
          {typeLabel}
        </span>
        {item.rating != null && (
          <span className="text-xs flex items-center gap-1 mt-auto pt-1">
            <Star size={12} className="fill-yellow-500 text-yellow-500" />
            {item.rating}/10
          </span>
        )}
      </div>
    </Link>
  );
};
