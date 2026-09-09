import { createFileRoute, Link } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout.tsx";
import { LoaderCircle, Star, ArrowLeft, BookOpen, Clapperboard, Monitor, DiscAlbum, ExternalLink } from "lucide-react";
import { useCMSShelfItem } from "@/hooks/server/cms/GET/useCMSShelfItems";
import { excerptFromHtml, useDynamicHead } from "@/lib/seo";

export const Route = createFileRoute("/shelf-items/$slug")({
  component: RouteComponent,
});

const catIconMap: Record<string, { icon: React.ReactNode; label: string }> = {
  Book:    { icon: <BookOpen size={20} />,      label: "Book" },
  Movie:   { icon: <Clapperboard size={20} />,   label: "Movie" },
  "TV Show": { icon: <Monitor size={20} />,      label: "TV Show" },
  Series:  { icon: <Monitor size={20} />,        label: "Series" },
  Album:   { icon: <DiscAlbum size={20} />,      label: "Album" },
  Music:   { icon: <DiscAlbum size={20} />,      label: "Music" },
};

function starRating(rating: number) {
  const full = Math.floor(rating);
  const rest = rating - full;
  const stars: React.ReactNode[] = [];

  for (let i = 0; i < full; i++) {
    stars.push(
      <Star key={`full-${i}`} size={16} className="fill-yellow-500 text-yellow-500" />,
    );
  }
  if (rest >= 0.25) {
    stars.push(
      <Star
        key="partial"
        size={16}
        className="text-yellow-500"
        style={{ clipPath: `inset(0 ${100 - rest * 100}% 0 0)` }}
      />,
    );
  }
  const empty = 10 - Math.ceil(rating);
  for (let i = 0; i < empty; i++) {
    stars.push(
      <Star key={`empty-${i}`} size={16} className="text-muted-foreground" />,
    );
  }

  return stars;
}

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data: item, isLoading, error } = useCMSShelfItem(slug);

  useDynamicHead(
    item
      ? {
          title: item.title,
          description:
            excerptFromHtml(item.review) || item.description || `Shelf item: ${item.title}`,
          path: `/shelf-items/${slug}`,
          image: item?.coverImage?.url ?? undefined,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: item.title,
            description: excerptFromHtml(item.review) || item.description || undefined,
            author: {
              "@type": "Person",
              name: "Lawrence Brown",
              url: "https://lbdluxe.com",
            },
            mainEntityOfPage: `https://lbdluxe.com/shelf-items/${slug}`,
          },
        }
      : null,
    [item, slug],
  );

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center py-16">
          <LoaderCircle className="animate-spin text-muted-foreground" size={48} />
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <p className="text-red-500 p-4">{error.message}</p>
      </DefaultLayout>
    );
  }

  if (!item) {
    return (
      <DefaultLayout>
        <p className="text-muted-foreground p-4">Item not found.</p>
      </DefaultLayout>
    );
  }

  const mediaCategory = item.shelfCategories?.[0];
  const typeInfo = mediaCategory ? catIconMap[mediaCategory.title] : null;
  const typeLabel = typeInfo?.label ?? "Item";

  return (
    <>
      <DefaultLayout>
        <div className="max-w-4xl mx-auto p-4 mt-3">
          <Link
            to="/shelf-items"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to shelf
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 shrink-0">
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-muted">
                {item.coverImage?.url ? (
                  <img
                    src={item.coverImage.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {typeInfo?.icon ?? <BookOpen size={48} />}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  {typeInfo?.icon}
                  <span>{typeLabel}</span>
                </div>
                <h1 className="text-3xl font-bold">{item.title}</h1>
                {item.authors && item.authors.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    by {item.authors.map((a) => a.title).join(", ")}
                  </p>
                )}
              </div>

              {item.rating != null && (
                <div className="flex items-center gap-2">
                  <div className="flex">{starRating(item.rating)}</div>
                  <span className="text-lg font-semibold">{item.rating}/10</span>
                </div>
              )}

              {item.description && (
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              )}

              {item.review && (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: item.review }} />
                </div>
              )}

              {item.links && item.links.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.links.map((link) => (
                    <a
                      key={link.id ?? link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm border border-border rounded-md px-3 py-1.5 hover:bg-accent transition-colors"
                    >
                      <ExternalLink size={14} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
}
