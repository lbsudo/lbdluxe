import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import AdminLayout from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGetAllBlogPosts } from "@/hooks/server/supabase/blog/GET/useGetAllBlogPosts.ts";
import { useDeleteBlogPost } from "@/hooks/server/supabase/blog/DELETE/useDeleteBlogPost.ts";
import { toast } from "sonner";
import type { BlogPost } from "shared";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/content/blog" as any)({
  component: RouteComponent,
  ssr: false,
});



function RouteComponent() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const { data: blogPostsResponse, isLoading, error } = useGetAllBlogPosts();
  const deleteBlogPostMutation = useDeleteBlogPost({
    onSuccess: () => {
      toast.success("Blog post deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete blog post: " + error.message);
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const columnHelper = createColumnHelper<BlogPost>();

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
      cell: (info) => (
        <div className="max-w-xs truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("author", {
      header: "Author",
    }),
    columnHelper.accessor("date_posted", {
      header: "Date Posted",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("tags", {
      header: "Tags",
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {info.getValue().map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const post = info.row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/admin/content/blog-edit", search: { id: post.id } })}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive" size="sm">Delete</Button>}
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{post.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteBlogPostMutation.mutate(post.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: blogPostsResponse?.success ? blogPostsResponse.blogPosts : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  

  const blogPosts = blogPostsResponse?.success ? blogPostsResponse.blogPosts : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Blog Posts</h1>
          <Button onClick={() => navigate({ to: "/admin/content/blog-edit", search: { id: undefined } })}>
            Create New Blog Post
          </Button>
        </div>



        {!isClient ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <>
            {isLoading && (
              <p className="text-muted-foreground">Loading blog posts…</p>
            )}

            {error && <p className="text-red-500">{error.message}</p>}

            {blogPosts.length === 0 && !isLoading && (
              <p className="text-muted-foreground">No blog posts found.</p>
            )}

            {blogPosts.length > 0 && (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-3 py-2 text-left font-medium"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-t hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-3 py-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}