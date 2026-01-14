import { createFileRoute, useNavigate } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout";
import { useGetAllBlogPosts } from "@/hooks/server/supabase/blog/GET/useGetAllBlogPosts";
import { slugify } from "@/lib/slugify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/blog/" as any)({
  component: BlogList,
});

function BlogList() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllBlogPosts();

  if (isLoading)
    return <p className="text-muted-foreground">Loading blog posts…</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  const posts = data?.success ? data.blogPosts : [];

  return (
    <DefaultLayout>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate({ to: `/blog/${slugify(post.title)}` })}
          >
            <figure className="overflow-hidden rounded-t-2xl">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <CardContent>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <time>{new Date(post.date_posted).toLocaleDateString()}</time>
                {post.tags?.length && (<>

                    <span className="mx-2">·</span>
                    <div className="flex gap-1">
                      {post.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>

</>)}
              </div>
              {/* Description – fallback to snippet if not provided */}
              {(post as any).description ? (
                <CardDescription className="mt-2 line-clamp-3">
                  {(post as any).description}
                </CardDescription>
              ) : (
                <CardDescription className="mt-2 line-clamp-3">
                  {post.content.replace(/<[^>]*>/g, "").slice(0, 150)}…
                </CardDescription>
              )}
            </CardContent>
          </Card>
        ))}
      </section>
    </DefaultLayout>
  )
}
