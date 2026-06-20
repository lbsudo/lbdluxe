import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout.tsx";
import PageHeader from "@/components/global/page-header.tsx";
import { LuGithub } from "react-icons/lu";
import { WorkCard } from "@/components/pages/Works/WorkCard";
import { LoaderCircle } from "lucide-react";
import { useCMSWorks } from "@/hooks/server/cms/GET/useCMSWorks";

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
  const { data: works, isLoading, error } = useCMSWorks();

  return (
    <>
      <DefaultLayout>
        <PageHeader
          buttonText={headerData.buttonText}
          title={headerData.title}
          description={headerData.description}
          icon={<LuGithub size={16} />}
          iconSize={16}
        />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-3">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-8">
                <LoaderCircle className="animate-spin text-muted-foreground" size={48} />
              </div>
            ) : error ? (
              <p className="col-span-full text-red-500">{error.message}</p>
            ) : !works || works.length === 0 ? (
              <p className="col-span-full text-muted-foreground">No works found.</p>
            ) : (
              works.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))
            )}
          </div>
      </DefaultLayout>
    </>
  );
}
