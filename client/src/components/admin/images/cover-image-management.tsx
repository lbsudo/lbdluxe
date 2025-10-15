import {Button} from "@/components/ui/button.tsx";
import {X} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export function CoverImageManagement() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [deleteUrl, setDeleteUrl] = useState<string | null>(null); // URL of image to delete
    const [dialogOpen, setDialogOpen] = useState(false);

    const {data: coverImages = [], refetch, isFetching} = useQuery<string[]>({
        queryKey: ["coverImages"],
        queryFn: async () => {
            const res = await fetch(`${SERVER_URL}/api/listCoverImages`);
            const text = await res.text();

            let data: { success: boolean; images: string[] } = {success: false, images: []};
            try {
                data = JSON.parse(text);
            } catch {
                console.error("Invalid JSON response:", text);
            }

            if (!data.success) throw new Error("Failed to fetch images");

            return data.images;
        },
    });

    const {mutate: uploadCoverImage, isPending} = useMutation({
        mutationFn: async (fileToUpload: File) => {
            if (!fileToUpload) throw new Error("No file selected");

            const res = await fetch(`${SERVER_URL}/api/uploadCoverImage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream",
                    "x-filename": fileToUpload.name,
                },
                body: await fileToUpload.arrayBuffer(),
            });

            const data = await res.json() as { success: true; url: string } | { success: false; error: string };
            if (!data.success) throw new Error(data.error);

            setUploadedUrl(data.url);
            refetch(); // refresh gallery after upload
        },
    });

    const {mutate: deleteCoverImage} = useMutation({
        mutationFn: async (url: string) => {
            const res = await fetch(`${SERVER_URL}/api/deleteCoverImage`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({url}),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            refetch();
            setDialogOpen(false); // close dialog after deletion
        },
    });

    const openDeleteDialog = (url: string) => {
        setDeleteUrl(url);
        setDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deleteUrl) deleteCoverImage(deleteUrl);
    };

    return (
        <>
            <div className="flex flex-col gap-4 py-4">
                <h1 className="text-2xl font-bold">Upload Cover Images</h1>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)}/>
                <Button onClick={() => file && uploadCoverImage(file)} disabled={isPending}>
                    {isPending ? "Uploading..." : "Upload"}
                </Button>

                {uploadedUrl && (
                    <div className="mt-4">
                        <p>Uploaded Image URL:</p>
                        <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
                        <img src={uploadedUrl} alt="Uploaded" className="mt-2 max-w-xs"/>
                    </div>
                )}

                {/* Image Gallery */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    {isFetching && <p>Loading images...</p>}
                    {coverImages.map((url) => (
                        <div key={url} className="relative">
                            <img src={url} alt="cover" className="w-full h-auto rounded"/>
                            <button
                                onClick={() => openDeleteDialog(url)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                                <X/>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this image?</p>
                        <DialogFooter className="flex gap-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}