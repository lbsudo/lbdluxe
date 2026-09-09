import { createFileRoute, useNavigate } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout";
import PageHeader from "@/components/global/page-header";
import { useCMSPosts } from "@/hooks/server/cms/GET/useCMSPosts";
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage";
import { useCMSSite } from "@/hooks/server/cms/GET/useCMSSite";
import { usePageHead } from "@/lib/seo";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/blog/")({
  component: BlogList,
});

const headerData = {
  buttonText: "Read Blog",
  title: "BLOG",
  description:
    "A collection of articles where I share ideas, tutorials, and updates. Click a post to read the full content.",
};

function BlogList(): React.ReactElement {
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = useCMSPosts();
  const { data: cmsPage } = useCMSPage("blog");
  const { data: site } = useCMSSite();
  usePageHead(cmsPage, site, {
    title: "Blog",
    description:
      "Articles by Lawrence Brown — ideas, tutorials, and updates on web development.",
    path: "/blog",
  });

  if (error) return <p className="text-red-500">{error.message}</p>;

  if (isLoading) {
    return (
      <DefaultLayout>
        <PageHeader
          page={cmsPage}
          buttonText={headerData.buttonText}
          title={headerData.title}
          description={headerData.description}
        />
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4 z-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="pt-0">
              <Skeleton className="h-48 w-full rounded-t-2xl rounded-b-none" />
              <CardContent>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </section>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <PageHeader
        page={cmsPage}
        buttonText={headerData.buttonText}
        title={headerData.title}
        description={headerData.description}
      />

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4 z-2">
        {posts?.map((post) => (
          <Card
            key={post.id}
            className="cursor-pointer hover:shadow-lg transition-shadow pt-0"
            onClick={() => navigate({ to: `/blog/${post.slug ?? post.id}` })}
          >
            {post.heroImage?.url && (
              <figure className="overflow-hidden rounded-t-2xl">
                <img
                  src={post.heroImage.url}
                  alt={post.heroImage.alt ?? post.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
            )}
            <CardContent>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                {post.publishedAt && (
                  <time>
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </time>
                )}
              </div>
              <CardDescription className="mt-2 line-clamp-3">
                {post.content.replace(/<[^>]*>/g, "").slice(0, 150)}…
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </DefaultLayout>
  );
}
