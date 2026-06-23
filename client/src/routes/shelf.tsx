import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout.tsx";
import PageHeader from "@/components/global/page-header.tsx";
import { LoaderCircle, Library } from "lucide-react";
import { useCMSShelfCategories } from "@/hooks/server/cms/GET/useCMSShelfCategories";
import { useCMSShelfItems } from "@/hooks/server/cms/GET/useCMSShelfItems";
import { ShelfCategoryItemCard } from "@/components/pages/Shelf/ShelfCategoryItemCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shelf")({
  validateSearch: (input: Record<string, unknown>) => {
    const val = input.category
    if (typeof val === "number" && Number.isFinite(val)) return { category: val }
    if (typeof val === "string" && Number.isFinite(Number(val))) return { category: Number(val) }
    return { category: undefined }
  },
  component: RouteComponent,
});

const headerData = {
  buttonText: "Browse Categories",
  title: "THE SHELF",
  description: "Explore my collection by category.",
};

function RouteComponent() {
  const { category } = useSearch({ from: "/shelf" });
  const navigate = useNavigate();

  const { data: categories, isLoading: catsLoading, error: catsError } = useCMSShelfCategories();
  const { data: items, isLoading: itemsLoading, error: itemsError } = useCMSShelfItems(category);

  const selectedCategory = categories?.find((c) => c.id === category);

  return (
    <>
      <DefaultLayout>
        <PageHeader
          buttonText={headerData.buttonText}
          title={headerData.title}
          description={headerData.description}
          icon={<Library size={16} />}
          iconSize={16}
        />

        <div className="relative z-10 flex gap-2 p-4 pb-0 mt-3 overflow-x-auto">
          {catsLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="animate-spin" size={16} />
              Loading categories...
            </div>
          ) : catsError ? (
            <p className="text-sm text-red-500">{catsError.message}</p>
          ) : (
            categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  navigate({ to: "/shelf", search: { category: category === cat.id ? undefined : cat.id } })
                }
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer",
                  selectedCategory?.id === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-foreground border-border hover:text-foreground hover:bg-accent/50",
                )}
              >
                {cat.title}
              </button>
            ))
          )}
        </div>

        <div className="relative z-10">
          {!category ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Library size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-medium">Select a category to browse items</p>
            </div>
          ) : itemsLoading ? (
            <div className="flex justify-center items-center py-16">
              <LoaderCircle className="animate-spin text-muted-foreground" size={48} />
            </div>
          ) : itemsError ? (
            <p className="text-red-500 p-4">{itemsError.message}</p>
          ) : items && items.length > 0 ? (
            <div className="flex flex-col gap-3 p-4">
              {items.map((item) => (
                <ShelfCategoryItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground p-4">No items found in this category.</p>
          )}
        </div>
      </DefaultLayout>
    </>
  );
}
