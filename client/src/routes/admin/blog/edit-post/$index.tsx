import { createFileRoute } from '@tanstack/react-router'
import AdminLayout from "@/layouts/admin.tsx";

export const Route = createFileRoute('/admin/blog/edit-post/$index')({
    component: RouteComponent,
})

function RouteComponent() {
    return <AdminLayout path="/admin/blog/edit-post">
        This is where the stuff to edit the post will go.

    </AdminLayout>
}
