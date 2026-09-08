import { createFileRoute } from "@tanstack/react-router";

import AdminLayout from "@/layouts/admin-layout.tsx";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    links: [{ rel: "canonical", href: `${SITE_URL}/admin` }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AdminLayout>yuhhh</AdminLayout>
    </>
  );
}
