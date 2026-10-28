import type { CMSShopCard } from "shared";
import { ArrowUpRight } from "lucide-react";

interface ShopCardProps {
  card: CMSShopCard;
}

/** Pick black/white text for a solid accent background based on luminance. */
function contrastText(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#0a0a0a" : "#ffffff";
}

export function ShopCard({ card }: ShopCardProps) {
  const accent = card.accentColor || "#6366f1";
  const badgeText = contrastText(accent);

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full flex-col rounded-lg border bg-neutral-900/50 p-4 backdrop-blur-sm transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex items-start justify-between gap-3">
        {card.image?.url ? (
          <img
            src={card.image.url}
            alt={card.image.alt || card.title}
            className="h-16 w-16 shrink-0 object-contain"
          />
        ) : (
          card.badge && (
            <span
              className="rounded px-2 py-0.5 text-xs font-semibold"
              style={{ background: accent, color: badgeText }}
            >
              {card.badge}
            </span>
          )
        )}
        <ArrowUpRight className="h-5 w-5 shrink-0" style={{ color: accent }} />
      </div>

      {card.image?.url && card.badge && (
        <span
          className="mt-2 self-start rounded px-2 py-0.5 text-xs font-semibold"
          style={{ background: accent, color: badgeText }}
        >
          {card.badge}
        </span>
      )}

      <h3 className="mt-3 text-lg font-bold">{card.title}</h3>
      {card.description && (
        <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: accent }}
        >
          {card.urlLabel || card.url}
        </span>
        <span className="text-xs font-medium text-muted-foreground group-hover:underline">
          Enter →
        </span>
      </div>
    </a>
  );
}