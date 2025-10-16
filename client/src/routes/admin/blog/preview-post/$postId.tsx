import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/admin.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
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

export const Route = createFileRoute('/admin/blog/preview-post/$postId')({
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
        <AdminLayout path="/admin/blog/preview-post">
            <div className="flex flex-col gap-6 w-full py-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/blog">
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Blog Post Preview</h1>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-4">
                        This is how your post will appear on the main blog page:
                    </p>

                    {isLoading ? (
                        <Card className="max-w-sm">
                            <CardHeader>
                                <Skeleton className="h-48 w-full rounded-md" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-6 w-3/4" />
                            </CardContent>
                        </Card>
                    ) : post ? (
                        <Card className="max-w-sm overflow-hidden hover:shadow-lg transition-shadow pt-0 gap-0">
                            <CardHeader className="p-0">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                            </CardHeader>
                            <CardContent className="px-2 pt-2">
                                <CardTitle className="text-2xl line-clamp-2">{post.title}</CardTitle>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {post.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-3 text-sm text-muted-foreground">
                                    By {post.author}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            Blog post not found
                        </div>
                    )}
                </div>

                {post && (
                    <div className="bg-card p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-4">Full Content Preview</h2>
                        <div
                            className="tiptap-editor"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}