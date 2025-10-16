import { createFileRoute, Link } from '@tanstack/react-router'
import DefaultLayout from "@/layouts/default.tsx";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";
import "@/styles/tiptap.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

interface BlogPost {
    id: number;
    coverImage: string;
    title: string;
    content: string;
    author: string;
    tags: string[];
    datePosted: string;
}

export const Route = createFileRoute('/blog/$postId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { postId } = Route.useParams();

    const { data: post, isLoading } = useQuery<BlogPost>({
        queryKey: ["blogPost", postId],
        queryFn: async () => {
            const res = await fetch(`${SERVER_URL}/api/getBlogPost/${postId}`);
            const json = await res.json();
            return json.post;
        },
    });

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-6 w-full py-8 max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-4">
                    <Link to="/blog">
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Back to Blog</h1>
                </div>

                {isLoading ? (
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-96 w-full rounded-lg" />
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                ) : post ? (
                    <article className="flex flex-col gap-6">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-96 object-cover rounded-lg"
                        />

                        <div className="flex flex-col gap-4">
                            <h1 className="text-5xl font-bold">{post.title}</h1>

                            <div className="flex items-center gap-4 text-muted-foreground">
                                <span>By {post.author}</span>
                                <span>•</span>
                                <span>{new Date(post.datePosted).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-border pt-6">
                            <div
                                className="tiptap-editor"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>
                    </article>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        Blog post not found
                    </div>
                )}
            </div>
        </DefaultLayout>
    )
}