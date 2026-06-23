import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout.tsx";
import PageHeader from "@/components/global/page-header.tsx";
import { Github } from "lucide-react";
import { RenderBlock } from "@/components/cms/render-block";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage";

export const Route = createFileRoute("/works")({
  component: RouteComponent,
});

const headerData = {
  buttonText: "Learning Projects",
  title: "RECENT WORK",
  description:
    "I'm thrilled to showcase some of my recent projects that demonstrate my passion for crafting intuitive user experiences and robust, efficient software solutions.",
};

function RouteComponent() {
  const { data: cmsPage, isLoading, error } = useCMSPage("works");

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
          <p className="text-muted-foreground">Loading works…</p>
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
          <p className="text-muted-foreground">No works found.</p>
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
