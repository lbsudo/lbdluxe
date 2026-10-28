import type { CMSShopCard } from "shared";
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { NeonWireframe } from "./NeonWireframe";

interface NeonShopCardProps {
  card: CMSShopCard;
}

export function NeonShopCard({ card }: NeonShopCardProps) {
  const shape = (card.shape || "cube") as "cube" | "octahedron" | "tetrahedron" | "pyramid" | "prism" | "globe"

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ "--hue-offset": card.hueOffset ?? 0 } as React.CSSProperties}
      className="neon-card group relative flex flex-col"
    >
      <div className="neon-card__scene">
        <div className="neon-card__floor" aria-hidden />
        <div className="neon-wireframe-wrap" aria-hidden>
          <NeonWireframe shape={shape} hueOffset={card.hueOffset ?? 0} />
        </div>
        {card.badge && (
          <span className="neon-card__badge">{card.badge}</span>
        )}
      </div>

      <div className="neon-card__body">
        <h3 className="neon-card__title">{card.title}</h3>
        {card.description && (
          <p className="neon-card__description">{card.description}</p>
        )}

        <div className="neon-card__row">
          <span className="neon-card__url">{card.urlLabel || card.url}</span>
          <span className="neon-card__enter">
            Enter <ArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </a>
  )
}