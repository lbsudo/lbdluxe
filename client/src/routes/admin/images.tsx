import {createFileRoute} from '@tanstack/react-router';
import AdminLayout from "@/layouts/admin.tsx";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {Button} from "@/components/ui/button.tsx";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const Route = createFileRoute('/admin/images')({
    component: RouteComponent,
});

function RouteComponent() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const {mutate: uploadImage, isPending} = useMutation({
        mutationFn: async (fileToUpload: File) => {
            if (!fileToUpload) throw new Error("No file selected");

            // Use fetch directly for raw file uploads
            const res = await fetch(`${SERVER_URL}/api/uploadImage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream",
                    "x-filename": fileToUpload.name,
                },
                body: await fileToUpload.arrayBuffer(), // raw bytes
            });

            const data = await res.json() as
                | { success: true; url: string }
                | { success: false; error: string };

            if (!data.success) throw new Error(data.error);

            setUploadedUrl(data.url);
        },
    });


    return (
        <AdminLayout>
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Upload an Image</h1>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Button
                    onClick={() => file && uploadImage(file)}
                    disabled={isPending}
                >
                    {isPending ? "Uploading..." : "Upload"}
                </Button>

                {uploadedUrl && (
                    <div className="mt-4">
                        <p>Uploaded Image URL:</p>
                        <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                            {uploadedUrl}
                        </a>
                        <img src={uploadedUrl} alt="Uploaded" className="mt-2 max-w-xs"/>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
