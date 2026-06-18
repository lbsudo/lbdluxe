import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import { useCMSPost } from "@/hooks/server/cms/GET/useCMSPost";
import "@/styles/tiptap.css";

import { Skeleton } from "@/components/ui/skeleton";
import { ControlBar } from "@/components/global/navigation/ControlBar";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  ssr: false,
});

function BlogPost() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useCMSPost(slug);

  if (isLoading) {
    return (
      <div className="relative flex justify-center items-center flex-col bg-background">
        <Skeleton className="w-screen h-[75vh]" />
        <div className="max-w-4xl mx-auto p-4 space-y-4 mt-8">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-48 w-full" />
        </div>
        <ControlBar />
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error.message}</p>;

  if (!post) {
    return (
      <section className="p-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="mt-4">
          The article you're looking for doesn't exist.{" "}
          <button
            className="text-primary underline"
            onClick={() => navigate({ to: "/blog" })}
          >
            Go back to the blog list
          </button>
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="relative flex justify-center items-center flex-col bg-background">
        <figure className="relative w-screen h-[75vh] overflow-hidden">
          {post.heroImage?.url && (
            <img
              src={post.heroImage.url}
              alt={post.heroImage.alt ?? post.title}
              className="w-full h-full object-cover"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, background 21%, transparent)",
                maskImage:
                  "linear-gradient(to bottom, background 21%, transparent)",
              }}
            />
          )}
          <div className="absolute left-0 right-0 bottom-0 mx-auto max-w-4xl px-4 text-left">
            <h1 className="text-6xl font-medium text-foreground drop-shadow-lg">
              {post.title}
            </h1>
            <div className="flex justify-start mt-2 space-x-8">
              <div className="text-left">
                <p className="text-sm font-medium text-foreground/70">Author</p>
                <p className="text-base text-foreground">
                  {post.authors?.map((a) => a.name).join(", ") ?? "—"}
                </p>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground/70">
                  Date Published
                </p>
                <p className="text-base text-foreground">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </figure>

        <article className="max-w-4xl mx-auto p-4 space-y-6 text-left flex justify-start items-start w-full mt-8">
          <section
            className="ProseMirror"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
      <ControlBar />
    </>
  );
}
