import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { FitnessProductCard } from "@/components/pages/Fitness/FitnessProductCard";
import {
  FITNESS_TYPE_META,
  isFitnessType,
} from "@/components/pages/Fitness/fitness-utils";
import { useCMSFitnessProducts } from "@/hooks/server/cms/GET/useCMSFitnessProducts";
import { useCMSSite } from "@/hooks/server/cms/GET/useCMSSite";
import { useDynamicHead } from "@/lib/seo";

export const Route = createFileRoute("/fitness/$type/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { type } = Route.useParams();
  const valid = isFitnessType(type);
  const { data: products, isLoading, error } = useCMSFitnessProducts(
    valid ? type : undefined,
  );
  const { data: site } = useCMSSite();

  const meta = valid ? FITNESS_TYPE_META[type] : null;

  useDynamicHead(
    meta
      ? {
          title: `${meta.label} — Fitness Shop`,
          description: meta.description,
          path: `/fitness/${type}`,
          host: "shop",
        }
      : null,
    [type, site?.defaultTitle],
  );

  if (!meta) {
    return (
      <p className="mx-auto mt-8 max-w-5xl px-4 text-muted-foreground">
        Category not found.
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-muted-foreground">{meta.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
        </div>
      </div>

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
        <p className="text-muted-foreground">
          Nothing here yet — check back soon.
        </p>
      )}
    </section>
  );
}
