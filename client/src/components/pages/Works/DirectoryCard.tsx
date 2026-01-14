import React from "react";
import type { Work } from "shared";
import { ArrowUpRight } from "lucide-react";

interface WorksCardProps {
    works: Work[];
}

/**
 * Presentation component that renders a grid of work cards.
 * Data fetching is handled by the parent route component.
 */
export const WorksCard: React.FC<WorksCardProps> = ({ works }) => {
    return (
        <section className="my-12 mx-auto w-full sm:w-2/3 max-w-5xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
                {works.map((work) => {
                    const isClickable = work.directory && !!work.project_link;

                    const CardContent = (
                        <>
                            {/* Thumbnail – omitted when work is a directory */}
                            {!work.directory && (
                                work.image_urls?.[0] ? (
                                    <img
                                        src={work.image_urls[0]}
                                        alt={`${work.name} screenshot`}
                                        className="w-full h-32 object-cover rounded mb-3"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = "none";
                                        }}
                                    />
                                ) : work.icon_image_url ? (
                                    <img
                                        src={work.icon_image_url}
                                        alt={`${work.name} icon`}
                                        className="w-12 h-12 mb-3 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-12 h-12 mb-3 bg-muted rounded" />
                                )
                            )}

                            {/* Title */}
                            <h2 className="font-bold text-xl">{work.name}</h2>

                            {/* Description */}
                            <p className="text-sm flex-1 mt-2">{work.description}</p>

                            {/* Beta badge */}
                            {work.beta && (
                                <span className="mt-2 inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
                  Beta
                </span>
                            )}

                            {/* "View project" link – only for non‑directory works */}
                            {!work.directory && work.project_link && (
                                <a
                                    href={work.project_link}
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
                            href={work.project_link!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative block border rounded-lg p-4 flex flex-col bg-card hover:shadow-lg transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
