import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { ProductDetail } from "@/components/pages/Fitness/ProductDetail";
import { FITNESS_TYPE_META, isFitnessType } from "@/components/pages/Fitness/fitness-utils";
import { useCMSFitnessProduct } from "@/hooks/server/cms/GET/useCMSFitnessProducts";
import { excerptFromHtml, useDynamicHead } from "@/lib/seo";

export const Route = createFileRoute("/fitness/$type/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { type, slug } = Route.useParams();
  const { data: product, isLoading, error } = useCMSFitnessProduct(slug);

  const typeLabel = isFitnessType(type) ? FITNESS_TYPE_META[type].label : "Shop";

  useDynamicHead(
    product
      ? {
          title: `${product.title} — Fitness Shop`,
          description:
            product.shortDescription ||
            excerptFromHtml(product.description) ||
            `Buy ${product.title} from LBDLUXE.`,
          path: `/fitness/${type}/${slug}`,
          host: "shop",
          image: product.coverImage?.url ?? undefined,
          type: "website",
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.shortDescription || excerptFromHtml(product.description) || undefined,
            image: product.coverImage?.url ?? undefined,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: product.currency,
              availability: product.polarCheckoutLink && !product.comingSoon
                ? "https://schema.org/InStock"
                : "https://schema.org/PreOrder",
            },
          },
        }
      : null,
    [product, type, slug],
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-6">
      <Link
        to="/fitness/$type"
        params={{ type }}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to {typeLabel}
      </Link>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoaderCircle className="animate-spin text-muted-foreground" size={48} />
        </div>
      ) : error ? (
        <p className="text-red-500">{error.message}</p>
      ) : !product ? (
        <p className="text-muted-foreground">Product not found.</p>
      ) : (
        <ProductDetail product={product} />
      )}
    </div>
  );
}
