import { createFileRoute, Link } from '@tanstack/react-router'
import AdminLayout from "@/layouts/admin.tsx";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Button } from "@/components/ui/button.tsx";

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

export const Route = createFileRoute('/admin/blog/')({
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
    <AdminLayout path="/admin/blog">
      <div className="flex flex-col gap-6 w-full py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <Link to="/admin/blog/create-post">
            <Button>Create Post</Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <Skeleton className="h-48 w-full rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No blog posts yet. Create your first post!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer pt-0 gap-0">
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
                    <div className={'flex gap-2 mt-4'}>
                        <Button>Edit</Button>
                        <Button>Preview</Button>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
