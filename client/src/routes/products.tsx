import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout";
import PageHeader from "@/components/global/page-header";
import { Github } from "lucide-react";
import { RenderBlock } from "@/components/cms/render-block";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage";

export const Route = createFileRoute("/products")({
  component: RouteComponent,
});

const headerData = {
  buttonText: "Products",
  title: "PRODUCT CATALOG",
  description: "A list of our products.",
};

function RouteComponent() {
  const { data: cmsPage, isLoading, error } = useCMSPage("products");

  return (
    <>
      <DefaultLayout>
        <PageHeader
          buttonText={headerData.buttonText}
          title={headerData.title}
          description={headerData.description}
          icon={<Github size={16} />}
          iconSize={16}
        />
        {isLoading && (
          <p className="text-muted-foreground">Loading products…</p>
        )}
        {error && <p className="text-red-500">{error.message}</p>}
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
        ) : !isLoading && (
          <p className="text-muted-foreground">No products found.</p>
        )}
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
