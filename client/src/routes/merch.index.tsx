import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import {
  formatUSD,
  productImageUrl,
  useCMSMerchProducts,
  useCMSMerchVariants,
  variantProductId,
} from "@/hooks/server/cms/GET/useCMSMerch";
import { useDynamicHead } from "@/lib/seo";

export const Route = createFileRoute("/merch/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: products, isLoading, error } = useCMSMerchProducts();
  const { data: variants } = useCMSMerchVariants();

  useDynamicHead(
    {
      title: "Merch — LB Dluxe Shop",
      description: "LB Dluxe merch.",
      path: "/merch",
      host: "shop",
    },
    [],
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 text-center">
      <h1 className="shop-neon-text font-bebas text-5xl tracking-wide sm:text-7xl">MERCH</h1>

      {isLoading && (
        <div className="flex justify-center py-16">
          <LoaderCircle className="animate-spin text-muted-foreground" size={40} />
        </div>
      )}
      {error && <p className="mt-10 text-sm text-red-400">Could not load merch right now.</p>}
      {!isLoading && !error && (products ?? []).length === 0 && (
        <p className="mt-10 text-muted-foreground">New drops are on the way.</p>
      )}

      <div className="mt-10 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
        {(products ?? []).map((product) => {
          const prices = (variants ?? [])
            .filter((v) => variantProductId(v) === product.id && typeof v.priceInUSD === "number")
            .map((v) => v.priceInUSD as number);
          const from = prices.length ? Math.min(...prices) : null;
          const image = productImageUrl(product);
          return (
            <Link
              key={product.id}
              to="/merch/$slug"
              params={{ slug: product.slug ?? String(product.id) }}
              className="shop-panel flex flex-col gap-3 rounded-2xl p-5"
            >
              {image && (
                <img
                  src={image}
                  alt={product.title}
                  className="aspect-square w-full rounded-xl object-cover"
                  loading="lazy"
                />
              )}
              <h2 className="font-bebas text-2xl tracking-wide">{product.title}</h2>
              {from !== null && (
                <p className="text-sm text-muted-foreground">From {formatUSD(from)}</p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
