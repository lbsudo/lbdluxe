import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderCircle, ShoppingBag } from "lucide-react";
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
      {/* Hero — the shop's own header, not the main site's PageHeader. */}
      <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-4 pt-14 text-center sm:pt-20">
        <div className="shop-float mb-6">
          <div className="shop-rim">
            <span className="shop-rim-content font-bebas text-sm tracking-[0.3em] text-muted-foreground">
              SHOP.LBDLUXE.COM
            </span>
          </div>
        </div>
        <h1 className="shop-neon-text font-bebas text-6xl leading-[0.95] tracking-wide sm:text-8xl">
          {headerData.title}
        </h1>
        <p className="mt-4 max-w-xl font-bebas text-lg tracking-wider text-muted-foreground sm:text-xl">
          {headerData.description}
        </p>
      </section>

      {/* 3D category panels */}
      <section className="shop-3d mx-auto mt-12 grid w-full max-w-5xl gap-5 px-4 sm:grid-cols-3">
        {FITNESS_TYPE_ORDER.map((type) => {
          const meta = FITNESS_TYPE_META[type];
          return (
            <Link
              key={type}
              to="/fitness/$type"
              params={{ type }}
              className="shop-tilt group relative flex flex-col rounded-2xl"
            >
              <div aria-hidden className="shop-panel absolute inset-0" />
              <span className="shop-pop relative z-10 flex h-full flex-col gap-2 p-6 text-left">
                <span className="text-primary [filter:drop-shadow(0_0_12px_var(--primary))]">
                  {meta.icon}
                </span>
                <span className="font-bebas text-3xl tracking-wide text-foreground">
                  {meta.label}
                </span>
                <span className="text-sm text-muted-foreground">
                  {meta.tagline}
                </span>
                <span className="mt-3 text-xs font-semibold tracking-widest text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  BROWSE →
                </span>
              </span>
            </Link>
          );
        })}
      </section>

      {/* All products */}
      <section className="shop-3d mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-5 flex items-center gap-3">
          <ShoppingBag className="size-5 text-primary" />
          <h2 className="font-bebas text-3xl tracking-wide text-foreground">
            All products
          </h2>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoaderCircle className="animate-spin text-muted-foreground" size={40} />
          </div>
        ) : error ? (
          <p className="text-red-400">{error.message}</p>
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
