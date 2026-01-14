import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout.tsx";
import PageHeader from "@/components/global/page-header.tsx";
import { LuGithub } from "react-icons/lu";
import { WorkCard } from "@/components/pages/Works/WorkCard";
import { useGetAllWorks } from "@/hooks/server/supabase/works/GET/useGetAllWorks.ts";
import type { Work } from "shared";

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
  const { data: worksResponse, isLoading, error } = useGetAllWorks();
  const works: Work[] = worksResponse?.success ? worksResponse.works : [];

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
        {isLoading && <p className="text-muted-foreground">Loading works…</p>}
        {error && <p className="text-red-500">{error.message}</p>}
        {!isLoading && works.length === 0 && (
          <p className="text-muted-foreground">No works found.</p>
        )}
        {works.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mt-3">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </DefaultLayout>
    </>
  );
}
