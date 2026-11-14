import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { FitnessProductCard } from "@/components/pages/Fitness/FitnessProductCard";
import {
  FITNESS_TYPE_META,
  freeProgram,
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
          title: `${meta.label} — LB Dluxe Shop`,
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

  // The free program is code-owned, so it is listed alongside whatever the
  // CMS returns rather than being folded into it.
  const freeProducts = type === "program" ? [freeProgram] : []
  const paidProducts = products ?? []

  return (
    <section className="shop-3d mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <span className="text-primary [filter:drop-shadow(0_0_12px_var(--primary))]">
          {meta.icon}
        </span>
        <div>
          <h1 className="shop-neon-text font-bebas text-4xl tracking-wide sm:text-5xl">
            {meta.label}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* The free program is code-owned, so it renders even when the CMS is
            unreachable. Paid products still come from the CMS. */}
        {freeProducts.map((product) => (
          <FitnessProductCard key={product.id} product={product} />
        ))}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <LoaderCircle className="animate-spin text-muted-foreground" size={40} />
          </div>
        )}
        {paidProducts.map((product) => (
          <FitnessProductCard key={product.id} product={product} />
        ))}
      </div>
      {!isLoading && !error && paidProducts.length === 0 && (
        <p className="mt-6 text-muted-foreground">
          More programs are on the way — check back soon.
        </p>
      )}
      {error && (
        <p className="mt-6 text-sm text-red-400">
          Could not load the full catalog right now. The free program above is
          always available.
        </p>
      )}
    </section>
  );
}
