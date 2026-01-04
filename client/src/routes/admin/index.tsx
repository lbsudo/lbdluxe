import { createFileRoute } from "@tanstack/react-router";

import AdminLayout from "@/layouts/admin-layout.tsx";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AdminLayout>yuhhh</AdminLayout>
    </>
  );
}
