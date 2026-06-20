import React from "react";
import type { CMSWork } from "shared";
import { ArrowUpRight } from "lucide-react";

interface WorksCardProps {
  works: CMSWork[];
}

export const WorksCard: React.FC<WorksCardProps> = ({ works }) => {
  return (
    <section className="my-12 mx-auto w-full sm:w-2/3 max-w-5xl">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
        {works.map((work) => {
          const isClickable = work.directory && !!work.projectLink;

          const firstImageUrl = work.images?.[0]?.image?.url;

          const CardContent = (
            <>
              {!work.directory &&
                (firstImageUrl ? (
                  <img
                    src={firstImageUrl}
                    alt={`${work.name} screenshot`}
                    className="w-full h-32 object-cover rounded mb-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                ) : work.iconImage?.url ? (
                  <img
                    src={work.iconImage.url}
                    alt={`${work.name} icon`}
                    className="w-12 h-12 mb-3 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 mb-3 bg-muted rounded" />
                ))}

              <h2 className="font-bold text-xl">{work.name}</h2>

              <p className="text-sm flex-1 mt-2">{work.description}</p>

              {work.beta && (
                <span className="mt-2 inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                  Beta
                </span>
              )}

              {!work.directory && work.projectLink && (
                <a
                  href={work.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-primary hover:underline text-sm"
                >
                  View project →
                </a>
              )}
            </>
          );

          return isClickable ? (
            <a
              key={work.id}
              href={work.projectLink!}
              target="_blank"
              rel="noopener noreferrer"
              className="relative border rounded-lg p-4 flex flex-col bg-card hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {work.directory && (
                <ArrowUpRight className="absolute top-2 right-2 w-5 h-5 text-foreground" />
              )}
              {CardContent}
            </a>
          ) : (
            <div
              key={work.id}
              className="relative border rounded-lg p-4 flex flex-col bg-card hover:shadow-lg transition-shadow"
            >
              {work.directory && (
                <ArrowUpRight className="absolute top-2 right-2 w-5 h-5 text-foreground" />
              )}
              {CardContent}
            </div>
          );
        })}
      </div>
    </section>
  );
};
