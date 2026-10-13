import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderCircle, ShoppingBag } from "lucide-react";
import PageHeader from "@/components/global/page-header";
import { FitnessProductCard } from "@/components/pages/Fitness/FitnessProductCard";
import {
  FITNESS_TYPE_META,
  FITNESS_TYPE_ORDER,
} from "@/components/pages/Fitness/fitness-utils";
import { useCMSFitnessProducts } from "@/hooks/server/cms/GET/useCMSFitnessProducts";
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage";
import { useCMSSite } from "@/hooks/server/cms/GET/useCMSSite";
import { usePageHead } from "@/lib/seo";

export const Route = createFileRoute("/fitness/")({
  component: RouteComponent,
});

const headerData = {
  buttonText: "Shop",
  title: "THE SHOP",
  description: "Training programs, supplements, and research peptides.",
};

function RouteComponent() {
  const { data: cmsPage } = useCMSPage("fitness");
  const { data: products, isLoading, error } = useCMSFitnessProducts();
  const { data: site } = useCMSSite();

  usePageHead(cmsPage, site, {
    title: "Fitness Shop",
    description:
      "Training programs, supplements, and research peptides from LBDLUXE.",
    path: "/fitness",
    host: "shop",
  });

  return (
    <>
      <PageHeader
        page={cmsPage}
        buttonText={headerData.buttonText}
        title={headerData.title}
        description={headerData.description}
        icon={<ShoppingBag size={16} />}
        iconSize={16}
      />

      <section className="mx-auto mt-6 grid w-full max-w-5xl gap-4 px-4 sm:grid-cols-3">
        {FITNESS_TYPE_ORDER.map((type) => {
          const meta = FITNESS_TYPE_META[type];
          return (
            <Link
              key={type}
              to="/fitness/$type"
              params={{ type }}
              className="flex flex-col gap-2 rounded-lg border bg-card p-5 transition-colors hover:bg-accent/50"
            >
              <span className="text-muted-foreground">{meta.icon}</span>
              <span className="text-lg font-semibold">{meta.label}</span>
              <span className="text-sm text-muted-foreground">{meta.tagline}</span>
            </Link>
          );
        })}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-xl font-semibold">All products</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoaderCircle className="animate-spin text-muted-foreground" size={40} />
          </div>
        ) : error ? (
          <p className="text-red-500">{error.message}</p>
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <FitnessProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No products yet — check back soon.</p>
        )}
      </section>
    </>
  );
}
