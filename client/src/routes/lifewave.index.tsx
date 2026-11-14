import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, ExternalLink, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useCMSLifewave, useCMSLifewaveProducts } from "@/hooks/server/cms/GET/useCMSLifewave";
import { useDynamicHead } from "@/lib/seo";

export const Route = createFileRoute("/lifewave/")({
  component: RouteComponent,
});

const LIFEWAVE_PRODUCT_BASE = "https://lifewave.com/lbdluxe/store/product/";

function productUrl(sku: string) {
  return `${LIFEWAVE_PRODUCT_BASE}${encodeURIComponent(sku)}`;
}

function PromoCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={copy} className="shop-tab mx-auto mt-6 inline-flex">
      Promo code: <strong>{code}</strong>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function RouteComponent() {
  const { data: products, isLoading, error } = useCMSLifewaveProducts();
  const { data: settings } = useCMSLifewave();

  useDynamicHead(
    {
      title: "LifeWave — LB Dluxe Shop",
      description: "LifeWave products from LB Dluxe.",
      path: "/lifewave",
      host: "shop",
    },
    [],
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 text-center">
      <h1 className="shop-neon-text font-bebas text-5xl tracking-wide sm:text-7xl">
        LIFEWAVE
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-xs text-muted-foreground">
        Affiliate links: we earn a commission on purchases.
      </p>

      {settings?.promoCode && <PromoCode code={settings.promoCode} />}

      {isLoading && (
        <div className="flex justify-center py-16">
          <LoaderCircle className="animate-spin text-muted-foreground" size={40} />
        </div>
      )}
      {error && <p className="mt-10 text-sm text-red-400">Could not load products right now.</p>}

      <div className="mt-10 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(products ?? []).map((product) => (
          <div key={product.id} className="shop-panel flex flex-col gap-3 rounded-2xl p-5">
            {product.coverImage?.url && (
              <img
                src={product.coverImage.url}
                alt={product.title}
                className="aspect-square w-full rounded-xl object-cover"
                loading="lazy"
              />
            )}
            {product.productLine && (
              <span className="text-xs uppercase tracking-wider text-primary">
                {product.productLine}
              </span>
            )}
            <h2 className="font-bebas text-2xl tracking-wide">{product.title}</h2>
            <a
              href={productUrl(product.sku)}
              target="_blank"
              rel="sponsored noopener"
              className="shop-tab mt-auto inline-flex items-center justify-center gap-2"
            >
              Shop at LifeWave <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
