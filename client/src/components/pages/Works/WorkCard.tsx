import React from "react";
import type { Work } from "shared";
import { LuExternalLink } from "react-icons/lu";
import { ArrowUpRight } from "lucide-react";

interface WorkCardProps {
  work: Work;
}

/**
 * Presentation component that renders a single work card.
 * The parent route handles data fetching and mapping.
 */
export const WorkCard: React.FC<WorkCardProps> = ({ work }) => {
  const isClickable = work.directory && !!work.project_link;

  const CardContent = (
    <>
      {/* Thumbnail – omitted when work is a directory */}
      {!work.directory &&
        (work.image_urls?.[0] ? (
          <figure className="overflow-hidden rounded-t-2xl mb-3">
            <img
              src={work.image_urls[0]}
              alt={`${work.name} screenshot`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </figure>
        ) : work.icon_image_url ? (
          <img
            src={work.icon_image_url}
            alt={`${work.name} icon`}
            className="w-12 h-12 mb-3 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 mb-3 bg-muted rounded" />
        ))}

      <div className="px-4">
        {/* Title */}
        <h2 className="font-bold text-xl">{work.name}</h2>

        {/* Description */}
        <p className="text-sm flex-1 mt-2">{work.description}</p>

        {/* Beta badge */}
        {work.beta && (
          <span className="mt-2 inline-block w-1/3 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded text-center">
            Beta
          </span>
        )}

        {/* Action buttons – view project & repo (if available) */}
        {!work.directory && (
          <div className="flex justify-between mt-3">
            {work.project_link && (
              <a
                href={work.project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 border border-primary text-primary hover:bg-foreground hover:text-background px-3 py-1 rounded-md transition-colors text-sm"
              >
                <LuExternalLink size={14} />
                View project →
              </a>
            )}
            {work.repo_link && (
              <a
                href={work.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 border border-primary text-primary hover:bg-foreground hover:text-background px-3 py-1 rounded-md transition-colors text-sm"
              >
                <LuExternalLink size={14} />
                Repo →
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <section className="w-full">
      {isClickable ? (
        <a
          href={work.project_link!}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block border rounded-lg pb-6 flex flex-col h-full bg-card hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {work.directory && (
            <ArrowUpRight className="absolute top-2 right-2 w-5 h-5 text-foreground" />
          )}
          {CardContent}
        </a>
      ) : (
        <div className="relative border rounded-lg pb-6 flex flex-col h-full bg-card hover:shadow-lg transition-shadow">
          {work.directory && (
            <ArrowUpRight className="absolute top-2 right-2 w-5 h-5 text-foreground" />
          )}
          {CardContent}
        </div>
      )}
    </section>
  );
};
