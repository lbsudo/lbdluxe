import {Button} from "@/components/ui/button.tsx";
import {X, Copy, Check} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "sonner";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export function PostImageManagement() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [deleteUrl, setDeleteUrl] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const {data: postImages = [], refetch, isFetching} = useQuery<string[]>({
        queryKey: ["postImages"],
        queryFn: async () => {
            const res = await fetch(`${SERVER_URL}/api/listPostImages`);
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

    const {mutate: uploadPostImage, isPending} = useMutation({
        mutationFn: async (fileToUpload: File) => {
            if (!fileToUpload) throw new Error("No file selected");

            const res = await fetch(`${SERVER_URL}/api/uploadPostImage`, {
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
            setFile(null); // Reset file input
            toast.success("Image uploaded successfully!");
            refetch(); // refresh gallery after upload
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to upload image");
        },
    });

    const {mutate: deletePostImage} = useMutation({
        mutationFn: async (url: string) => {
            const res = await fetch(`${SERVER_URL}/api/deletePostImage`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({url}),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            toast.success("Image deleted successfully!");
            refetch();
            setDialogOpen(false);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete image");
        },
    });

    const openDeleteDialog = (url: string) => {
        setDeleteUrl(url);
        setDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deleteUrl) deletePostImage(deleteUrl);
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        toast.success("URL copied to clipboard!");
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    return (
        <>
            <div className="flex flex-col gap-4 py-4 border-t pt-8 mt-8">
                <h1 className="text-2xl font-bold">Upload Post Images</h1>
                <p className="text-sm text-muted-foreground">
                    Upload images to use within your blog post content. These images can be inserted using the editor's image button.
                </p>

                <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                    </div>
                    <Button onClick={() => file && uploadPostImage(file)} disabled={isPending || !file}>
                        {isPending ? "Uploading..." : "Upload"}
                    </Button>
                </div>

                {uploadedUrl && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="font-semibold text-green-800 dark:text-green-200 mb-2">✓ Image Uploaded Successfully!</p>
                        <div className="flex items-center gap-2 mb-2">
                            <a
                                href={uploadedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex-1 truncate"
                            >
                                {uploadedUrl}
                            </a>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(uploadedUrl)}
                            >
                                {copiedUrl === uploadedUrl ? <Check size={16} /> : <Copy size={16} />}
                            </Button>
                        </div>
                        <img src={uploadedUrl} alt="Uploaded" className="mt-2 max-w-xs rounded border"/>
                    </div>
                )}

                {/* Image Gallery */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Post Images Gallery ({postImages.length})</h2>
                    {isFetching && <p className="text-muted-foreground">Loading images...</p>}
                    {!isFetching && postImages.length === 0 && (
                        <p className="text-muted-foreground">No images uploaded yet. Upload your first image above!</p>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                        {postImages.map((url) => (
                            <div key={url} className="relative group">
                                <img src={url} alt="post" className="w-full h-auto rounded border"/>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => copyToClipboard(url)}
                                        className="bg-white/90 hover:bg-white"
                                    >
                                        {copiedUrl === url ? <Check size={16} /> : <Copy size={16} />}
                                    </Button>
                                    <button
                                        onClick={() => openDeleteDialog(url)}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-2 text-sm font-medium flex items-center gap-1"
                                    >
                                        <X size={16}/>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this image? This action cannot be undone.</p>
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