import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout";
import PageHeader from "@/components/global/page-header";
import { LuGithub } from "react-icons/lu";
import { ProductCard } from "@/components/pages/Products/ProductCard";
import { useCMSProducts } from "@/hooks/server/cms/GET/useCMSProducts";

export const Route = createFileRoute("/products")({
  component: RouteComponent,
});

const headerData = {
  buttonText: "Products",
  title: "PRODUCT CATALOG",
  description: "A list of our products.",
};

function RouteComponent() {
  const { data: products, isLoading, error } = useCMSProducts();

  return (
    <>
      <DefaultLayout>
        <PageHeader
          buttonText={headerData.buttonText}
          title={headerData.title}
          description={headerData.description}
          icon={<LuGithub size={16} />}
          iconSize={16}
        />
        {isLoading && (
          <p className="text-muted-foreground">Loading products…</p>
        )}
        {error && <p className="text-red-500">{error.message}</p>}
        {!isLoading && products?.length === 0 && (
          <p className="text-muted-foreground">No products found.</p>
        )}
        {products && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </DefaultLayout>
    </>
  );
}
