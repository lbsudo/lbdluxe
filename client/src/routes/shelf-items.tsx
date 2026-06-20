import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout.tsx";
import PageHeader from "@/components/global/page-header.tsx";
import { LuBookOpen } from "react-icons/lu";
import { ShelfCard } from "@/components/pages/Shelf/ShelfCard";
import { LoaderCircle } from "lucide-react";
import { useCMSShelfItems } from "@/hooks/server/cms/GET/useCMSShelfItems";

export const Route = createFileRoute("/shelf-items")({
  component: RouteComponent,
});

const headerData = {
  buttonText: "Media Library",
  title: "MY SHELF",
  description: "Books, movies, TV shows, and albums I've enjoyed.",
};

function RouteComponent() {
  const { data: items, isLoading, error } = useCMSShelfItems();

  return (
    <>
      <DefaultLayout>
        <PageHeader
          buttonText={headerData.buttonText}
          title={headerData.title}
          description={headerData.description}
          icon={<LuBookOpen size={16} />}
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
