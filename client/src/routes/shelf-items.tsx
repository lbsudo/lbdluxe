import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout.tsx";
import PageHeader from "@/components/global/page-header.tsx";
import { BookOpen } from "lucide-react";
import { ShelfCard } from "@/components/pages/Shelf/ShelfCard";
import { LoaderCircle } from "lucide-react";
import { useCMSShelfItems } from "@/hooks/server/cms/GET/useCMSShelfItems";
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage";
import { useCMSSite } from "@/hooks/server/cms/GET/useCMSSite";
import { seoHead, usePageHead } from "@/lib/seo";

export const Route = createFileRoute("/shelf-items")({
  head: () =>
    seoHead({
      title: "My Shelf",
      description: "Books, movies, TV shows, and albums Lawrence Brown has enjoyed.",
      path: "/shelf-items",
    }),
  component: RouteComponent,
});

const headerData = {
  buttonText: "Media Library",
  title: "MY SHELF",
  description: "Books, movies, TV shows, and albums I've enjoyed.",
};

function RouteComponent() {
  const { data: items, isLoading, error } = useCMSShelfItems();
  const { data: cmsPage } = useCMSPage("shelf-items");
  const { data: site } = useCMSSite();
  usePageHead(cmsPage, site, {
    title: "My Shelf",
    description: "Books, movies, TV shows, and albums Lawrence Brown has enjoyed.",
    path: "/shelf-items",
  });

  return (
    <>
      <DefaultLayout>
        <PageHeader
          page={cmsPage}
          buttonText={headerData.buttonText}
          title={headerData.title}
          description={headerData.description}
          icon={<BookOpen size={16} />}
          iconSize={16}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 mt-3">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-8">
              <LoaderCircle className="animate-spin text-muted-foreground" size={48} />
            </div>
          ) : error ? (
            <p className="col-span-full text-red-500">{error.message}</p>
          ) : items && items.length > 0 ? (
            items.map((item) => (
              <ShelfCard key={item.id} item={item} />
            ))
          ) : (
            <p className="col-span-full text-muted-foreground">No items found.</p>
          )}
        </div>
      </DefaultLayout>
    </>
  );
}
