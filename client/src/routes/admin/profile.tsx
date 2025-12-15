import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import { useGetProfileImages } from "@/hooks/supabase/useGetProfileImages";
import { useGetProfile } from "@/hooks/supabase/useGetProfile";
import { ProfileImageUploader } from "@/components/routes/admin/profile/ProfileImageUploader";
import { EditProfileForm } from "@/components/routes/admin/profile/EditProfileForm";
import { ProfileImageGrid } from "@/components/routes/admin/profile/ProfileImageGrid";

/* ----------------------------------------
   Route
---------------------------------------- */

export const Route = createFileRoute("/admin/profile")({
  component: RouteComponent,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:8787";

/* ----------------------------------------
   Component
---------------------------------------- */

type Mode = "edit" | "images";

function RouteComponent() {
  const [mode, setMode] = useState<Mode>("edit");

  const {
    data: images,
    isLoading: imagesLoading,
    error: imagesError,
  } = useGetProfileImages(SERVER_URL);

  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useGetProfile(SERVER_URL);

  return (
    <AdminLayout>
      {/* ----------------------------------------
         Mode Switch
      ---------------------------------------- */}

      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("edit")}
          className={`
            rounded-md px-3 py-1.5 text-sm font-medium
            ${
              mode === "edit"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }
          `}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => setMode("images")}
          className={`
            rounded-md px-3 py-1.5 text-sm font-medium
            ${
              mode === "images"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }
          `}
        >
          Images
        </button>
      </div>

      <h1 className="text-xl font-semibold mb-4">Profile</h1>

      {/* ----------------------------------------
         IMAGES MODE
      ---------------------------------------- */}

      {mode === "images" && (
        <>
          <ProfileImageUploader serverUrl={SERVER_URL} />
          <ProfileImageGrid serverUrl={SERVER_URL} images={images!} />

          {imagesLoading && <p>Loading images…</p>}
          {imagesError && <p className="text-red-500">{imagesError.message}</p>}
        </>
      )}

      {/* ----------------------------------------
         EDIT MODE
      ---------------------------------------- */}

      {mode === "edit" && (
        <>
          {profileLoading && <p>Loading profile…</p>}
          {profileError && (
            <p className="text-red-500">{profileError.message}</p>
          )}

          {images && profile && (
            <EditProfileForm
              serverUrl={SERVER_URL}
              images={images}
              profile={profile}
            />
          )}
        </>
      )}
    </AdminLayout>
  );
}
