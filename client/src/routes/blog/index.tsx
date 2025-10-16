import {createFileRoute, Link} from '@tanstack/react-router'
import DefaultLayout from "@/layouts/default.tsx";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {Button} from "@/components/ui/button.tsx";

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

export const Route = createFileRoute('/blog/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
        queryKey: ["blogPosts"],
        queryFn: async () => {
            const res = await fetch(`${SERVER_URL}/api/getBlogPosts`);
            const json = await res.json();
            return json.posts || [];
        },
    });

    return (
        <DefaultLayout>
            <div className="flex flex-col gap-6 w-full py-8">
                <div className="flex flex-col justify-center items-center gap-2">
                    <Button className={'rounded-full bg-transparent text-white border border-white text-xl p-6'}>
                        Read Latest Post
                    </Button>
                    <h1 className="text-7xl font-bold flex justify-center items-center">BLOG POST</h1>
                    <p className="text-neutral-400 text-center w-1/2 justify-center items-center flex text-xl font-medium">
                        Weekly topics that cover tech trends, software, productivity, and more. Beyond quick tips and grammar fixes and deep dive into the latest innovations.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, idx) => (
                            <Card key={idx}>
                                <CardHeader>
                                    <Skeleton className="h-48 w-full rounded-md" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : blogPosts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No blog posts available yet. Check back soon!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogPosts.map((post) => (
                            <Link
                                key={post.id}
                                to="/blog/$postId"
                                params={{ postId: post.id.toString() }}
                            >
                            <Card
                                key={post.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer pt-0 gap-0"
                            >
                                <CardHeader className="p-0">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                </CardHeader>
                                <CardContent className="px-2 pt-2">
                                    <CardTitle className="text-2xl line-clamp-2">
                                        {post.title}
                                    </CardTitle>
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
                                        By {post.author} • {new Date(post.datePosted).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </DefaultLayout>
    )
}