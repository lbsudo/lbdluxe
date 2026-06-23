import React from "react";
import type { CMSProductGridItem } from "shared";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: CMSProductGridItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isClickable = !!product.projectLink;

  const CardContent = (
    <div className="flex flex-col gap-6 flex-1">
      {product.iconImage?.url ? (
        <img
          src={product.iconImage.url}
          alt={`${product.name} icon`}
          className="w-16 h-16 object-contain"
        />
      ) : (
        <ArrowUpRight className="w-8 h-8 text-foreground" />
      )}
      <div className={"flex flex-col gap-2"}>
        <h2 className="font-bold text-lg">{product.name}</h2>
        <p className="text-sm">{product.description}</p>
      </div>
    </div>
  );

  return isClickable ? (
    <a
      href={product.projectLink!}
      target="_blank"
      rel="noopener noreferrer"
      className="relative  w-full border rounded-lg p-4 flex flex-col bg-neutral-900/50 backdrop-blur-sm hover:shadow-lg transition-shadow focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <ArrowUpRight className="absolute top-2 right-2 w-5 h-5 text-foreground" />
      {CardContent}
    </a>
  ) : (
    <div className="relative border rounded-lg p-6 flex flex-col bg-card hover:shadow-lg transition-shadow">
      <ArrowUpRight className="absolute top-2 right-2 w-5 h-5 text-foreground" />
      {CardContent}
    </div>
  );
};
