import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/layouts/admin-layout";
import { useGetProfileImages } from "@/hooks/supabase/useGetProfileImages";
import { ProfileImageUploader } from "@/components/routes/admin/profile/ProfileImageUploader";
import { ProfileImageGrid } from "@/components/routes/admin/profile/ProfileImageGrid";

export const Route = createFileRoute("/admin/profile")({
  component: RouteComponent,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:8787";

function RouteComponent() {
  const { data, isLoading, error } = useGetProfileImages(SERVER_URL);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Profile Images</h1>

      <ProfileImageUploader serverUrl={SERVER_URL} />

      {isLoading && <p>Loading images…</p>}

      {error && <p className="text-red-500">{(error as Error).message}</p>}

      {data && <ProfileImageGrid serverUrl={SERVER_URL} images={data} />}
    </AdminLayout>
  );
}
