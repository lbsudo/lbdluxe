import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout";
import PageHeader from "@/components/global/page-header";
import { Github } from "lucide-react";
import { RenderBlock } from "@/components/cms/render-block";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage";
import { useCMSSite } from "@/hooks/server/cms/GET/useCMSSite";
import { useCMSDigitalProducts } from "@/hooks/server/cms/GET/useCMSDigitalProducts";
import { DigitalProductCard } from "@/components/pages/Products/DigitalProductCard";
import { ShopCard } from "@/components/pages/Products/ShopCard";
import { usePageHead } from "@/lib/seo";

export const Route = createFileRoute("/products")({
  component: RouteComponent,
});

const headerData = {
  buttonText: "Products",
  title: "PRODUCT CATALOG",
  description: "A list of our products.",
};

function RouteComponent() {
  const { data: cmsPage, isLoading } = useCMSPage("products");
  const { data: products, isLoading: productsLoading, error: productsError } = useCMSDigitalProducts();
  const { data: site } = useCMSSite();
  usePageHead(cmsPage, site, {
    title: "Product Catalog",
    description: "A catalog of products curated by Lawrence Brown.",
    path: "/products",
  });

  return (
    <>
      <DefaultLayout>
        <PageHeader
          page={cmsPage}
          buttonText={headerData.buttonText}
          title={headerData.title}
          description={headerData.description}
          icon={<Github size={16} />}
          iconSize={16}
        />
        {productsLoading && (
          <p className="text-muted-foreground">Loading products…</p>
        )}
        {productsError && <p className="text-red-500">{productsError.message}</p>}
        {/* The fitness shop (shop.lbdluxe.com) is surfaced here as a card —
            it is not a nav option — and routes to its own subdomain. */}
        <motion.div
          className="px-4 py-6 max-w-6xl mx-auto w-full"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.section variants={fadeUp} className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ShopCard />
            {products?.map((product) => (
              <DigitalProductCard key={product.id} product={product} />
            ))}
          </motion.section>
        </motion.div>
        {cmsPage && cmsPage.layout.length > 0 ? (
          <motion.div
            className="max-w-6xl mx-auto flex flex-col gap-6 items-center justify-center"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {cmsPage.layout.map((block, i) => (
              <motion.section key={i} variants={fadeUp} className="w-full">
                <RenderBlock block={block} />
              </motion.section>
            ))}
          </motion.div>
        ) : !isLoading && !products?.length ? (
          <p className="text-muted-foreground">No products found.</p>
        ) : null}
      </DefaultLayout>
    </>
  );
}

const container = {
  hidden: {},
  visible: {
    transition: {
      delay: 0.5,
      staggerChildren: 0.4
    }
  }
};