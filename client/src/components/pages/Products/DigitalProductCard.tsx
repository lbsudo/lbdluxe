import React, { useEffect, useRef, useState } from "react";

import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import type { CMSDigitalProduct } from "shared";
import { toast } from "sonner";

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";
  if (Number.isInteger(price)) return `${symbol}${price}`;
  return `${symbol}${price.toFixed(2)}`;
}

type PolarCheckoutInstance = Awaited<ReturnType<typeof PolarEmbedCheckout.create>>

interface DigitalProductCardProps {
  product: CMSDigitalProduct;
}

export const DigitalProductCard: React.FC<DigitalProductCardProps> = ({ product }) => {
  const [buying, setBuying] = useState(false);
  const checkoutRef = useRef<PolarCheckoutInstance | null>(null);

  useEffect(() => {
    return () => {
      checkoutRef.current?.close();
      checkoutRef.current = null;
    };
  }, []);

  const openCheckout = async () => {
    if (buying) return;
    if (!product.polarCheckoutLink) {
      toast.error("This product is not available for purchase yet.");
      return;
    }

    setBuying(true);
    checkoutRef.current?.close();
    try {
      const checkout = await PolarEmbedCheckout.create(product.polarCheckoutLink, {
        theme: "dark",
      });
      checkoutRef.current = checkout;
      checkout.addEventListener("success", () => {
        toast.success("Thanks for your purchase! Your download is on its way.");
      });
    } catch (err) {
      console.error(err);
      toast.error("Checkout could not be opened. Please try again.");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="group flex flex-col rounded-lg overflow-hidden bg-card border hover:shadow-lg transition-shadow focus-within:outline focus-within:outline-offset-2 focus-within:outline-primary">
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {product.coverImage?.url ? (
          <img
            src={product.coverImage.url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No cover
          </div>
        )}
        {product.badge && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-1">{product.title}</h3>
        {product.shortDescription && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          <span className="text-sm font-bold">
            {formatPrice(product.price, product.currency)}
          </span>
          <button
            type="button"
            onClick={openCheckout}
            disabled={buying}
            className="px-3 py-1.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {buying ? "Opening…" : "Buy now"}
          </button>
        </div>
      </div>
    </div>
  );
};