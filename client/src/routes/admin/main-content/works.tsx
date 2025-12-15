import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/layouts/admin-layout";
import { useAddWork } from "@/hooks/supabase/useAddWork";

/* ----------------------------------------
   Helpers
---------------------------------------- */

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject("Invalid file result");
        return;
      }

      // strip data:image/...;base64,
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ----------------------------------------
   Route
---------------------------------------- */

export const Route = createFileRoute("/admin/main-content/works")({
  component: RouteComponent,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:8787";

/* ----------------------------------------
   Component
---------------------------------------- */

function RouteComponent() {
  const addWork = useAddWork(SERVER_URL);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [beta, setBeta] = useState(false);
  const [directory, setDirectory] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Add Work</h1>

      <div className="space-y-4 max-w-md">
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full rounded-md border px-3 py-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Project link"
          value={projectLink}
          onChange={(e) => setProjectLink(e.target.value)}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={beta}
            onChange={(e) => setBeta(e.target.checked)}
          />
          Beta
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={directory}
            onChange={(e) => setDirectory(e.target.checked)}
          />
          Directory
        </label>

        {/* Icon upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setIconFile(e.target.files?.[0] ?? null);
          }}
        />

        <button
          disabled={addWork.isPending}
          onClick={async () => {
            try {
              let icon_file_base64: string | undefined;
              let icon_filename: string | undefined;

              if (iconFile) {
                icon_file_base64 = await fileToBase64(iconFile);
                icon_filename = iconFile.name;
              }

              addWork.mutate(
                {
                  name,
                  description,
                  project_link: projectLink,
                  beta,
                  directory,
                  icon_file_base64,
                  icon_filename,
                },
                {
                  onSuccess: () => {
                    toast.success("Work added");
                    setName("");
                    setDescription("");
                    setProjectLink("");
                    setBeta(false);
                    setDirectory(false);
                    setIconFile(null);
                  },
                  onError: (err) =>
                    toast.error(
                      err instanceof Error ? err.message : "Failed to add work",
                    ),
                },
              );
            } catch {
              toast.error("Failed to process image");
            }
          }}
          className="
            rounded-md bg-primary px-4 py-2 text-sm
            text-primary-foreground hover:bg-primary/90
            disabled:opacity-50
          "
        >
          {addWork.isPending ? "Saving…" : "Save Work"}
        </button>
      </div>
    </AdminLayout>
  );
}
