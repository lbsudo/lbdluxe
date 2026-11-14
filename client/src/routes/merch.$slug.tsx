import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useMemo, useState } from "react";
import {
  formatUSD,
  productImageUrl,
  useCMSMerchProducts,
  useCMSMerchVariants,
  variantOptionObjects,
  variantProductId,
  type MerchVariant,
} from "@/hooks/server/cms/GET/useCMSMerch";
import { addVariantToCart } from "@/lib/merch-checkout";
import { useDynamicHead } from "@/lib/seo";

export const Route = createFileRoute("/merch/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { data: products, isLoading } = useCMSMerchProducts();
  const { data: variants } = useCMSMerchVariants();
  const product = products?.find((p) => (p.slug ?? String(p.id)) === slug);

  const productVariants = useMemo(
    () => (variants ?? []).filter((v) => product && variantProductId(v) === product.id),
    [variants, product],
  );

  // Each option type (e.g. Color, Size) becomes a selector with its choices.
  const types = useMemo(() => {
    const byName = new Map<string, { name: string; label: string; options: Map<number, string> }>();
    for (const variant of productVariants) {
      for (const option of variantOptionObjects(variant)) {
        if (!option.variantType || typeof option.variantType !== "object") continue;
        const type = option.variantType;
        const entry = byName.get(type.name) ?? { name: type.name, label: type.label, options: new Map() };
        entry.options.set(option.id, option.label);
        byName.set(type.name, entry);
      }
    }
    return [...byName.values()];
  }, [productVariants]);

  const [selected, setSelected] = useState<Record<string, number>>({});
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chosen: MerchVariant | undefined = productVariants.find((variant) => {
    const ids = variantOptionObjects(variant).map((o) => o.id);
    return types.every((t) => ids.includes(selected[t.name] ?? -1));
  });
  const ready = types.length > 0 && types.every((t) => selected[t.name] !== undefined) && chosen;

  useDynamicHead(
    product
      ? {
          title: `${product.title} — LB Dluxe Shop`,
          description: `Buy ${product.title} from LB Dluxe.`,
          path: `/merch/${slug}`,
          host: "shop",
        }
      : null,
    [product?.id, slug],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoaderCircle className="animate-spin text-muted-foreground" size={48} />
      </div>
    );
  }
  if (!product) {
    return <p className="mx-auto mt-10 max-w-5xl px-4 text-muted-foreground">Product not found.</p>;
  }

  const image = productImageUrl(product);

  async function addToCart() {
    if (!chosen) return;
    setAdding(true);
    setError(null);
    try {
      await addVariantToCart(product!.id, chosen.id);
      navigate({ to: "/merch/checkout" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add this item");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-8">
      <Link to="/merch" className="shop-tab mb-6 inline-flex">
        <ArrowLeft size={16} />
        Back to merch
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {image && (
          <img src={image} alt={product.title} className="w-full rounded-2xl object-cover" />
        )}
        <div className="flex flex-col gap-5">
          <h1 className="font-bebas text-5xl tracking-wide">{product.title}</h1>
          {chosen?.priceInUSD != null && (
            <p className="text-2xl">{formatUSD(chosen.priceInUSD)}</p>
          )}

          {types.map((type) => (
            <div key={type.name} className="flex flex-col gap-2">
              <span className="text-sm uppercase tracking-wider text-muted-foreground">{type.label}</span>
              <div className="flex flex-wrap gap-2">
                {[...type.options.entries()].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className="shop-tab"
                    data-active={selected[type.name] === id}
                    onClick={() => setSelected((s) => ({ ...s, [type.name]: id }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="shop-tab mt-2 justify-center"
            disabled={!ready || adding}
            onClick={addToCart}
          >
            {adding ? "Adding…" : ready ? "Add to cart" : "Choose options"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
