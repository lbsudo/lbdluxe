import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
import { useGetAllBlogPosts } from "@/hooks/server/supabase/blog/GET/useGetAllBlogPosts";
import { slugify } from "@/lib/slugify";
import "@/styles/tiptap.css"; // bring in the same styles as the editor
import { ThemeToggle } from "@/components/global/constants/theme/theme-toggle";
import { ControlBar } from "@/components/global/navigation/ControlBar";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  ssr: false,
});

function BlogPost() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetAllBlogPosts();

  if (isLoading)
    return <p className="text-muted-foreground">Loading blog post…</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  const posts = data?.success ? data.blogPosts : [];
  const post = posts.find((p) => slugify(p.title) === slug);

  if (!post) {
    return (
      <section className="p-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="mt-4">
          The article you’re looking for doesn’t exist.{" "}
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
        {/* Full‑width cover image – 75 vh tall, with transparent‑to‑background overlay */}
        <figure className="relative w-screen h-[75vh] overflow-hidden">
          {/* Image fills the figure with a mask that fades to transparent at 60% */}
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, background 21%, transparent)",
              maskImage:
                "linear-gradient(to bottom, background 21%, transparent)",
            }}
          />
          {/* Title + author/date overlay */}
          <div className="absolute top-4 right-4 z-20 dark:bg-neutral-600 bg-neutral-300 rounded-md">
            <ThemeToggle />
          </div>
          <div className=" absolute left-0 right-0 bottom-0 mx-auto max-w-4xl px-4 text-left">
            <h1 className="text-6xl font-medium text-foreground drop-shadow-lg">
              {post.title}
            </h1>
            <div className="flex justify-start mt-2 space-x-8">
              <div className="text-left">
                <p className="text-sm font-medium text-foreground/70">Author</p>
                <p className="text-base text-foreground">
                  {post.author ?? "—"}
                </p>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground/70">
                  Date Published
                </p>
                <p className="text-base text-foreground">
                  {new Date(post.date_posted).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </figure>

        <article className="max-w-4xl mx-auto p-4 space-y-6 text-left flex justify-start items-start w-full mt-8">
          {/* Blog content – raw HTML from TipTap */}
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
