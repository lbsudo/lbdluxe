import {createFileRoute} from '@tanstack/react-router';
import AdminLayout from "@/layouts/admin.tsx";
import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Input} from "@/components/ui/input.tsx";
// import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import {toast} from "sonner";
import TiptapEditor from "@/components/tip-tap-editor";



const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const Route = createFileRoute('/admin/blog/create-post')({
    component: RouteComponent,
});

function RouteComponent() {
    const queryClient = useQueryClient();

    const [coverImage, setCoverImage] = useState<string>("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [authorId, setAuthorId] = useState<string>("");
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const [newCategory, setNewCategory] = useState("");
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

    const [newAuthorName, setNewAuthorName] = useState("");
    const [isAddAuthorOpen, setIsAddAuthorOpen] = useState(false);

    // Fetch authors
    const {data: authors = []} = useQuery<{ id: number; name: string }[]>({
        queryKey: ["authors"],
        queryFn: async () => {
            const res = await fetch(`${SERVER_URL}/api/authors`);
            return res.json();
        },
    });

    // Fetch categories
    const {data: categories = []} = useQuery<{ id: number; name: string }[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${SERVER_URL}/api/categories`);
            return res.json();
        },
    });

    // Fetch cover images
    const {data: coverImages = []} = useQuery<string[]>({
        queryKey: ["cover-images"],
        queryFn: async () => {
            const res = await fetch(`${SERVER_URL}/api/listCoverImages`);
            const json = await res.json();
            return json.images || [];
        },
    });

    // Mutation to create blog post
    const {mutate: createPost, isPending} = useMutation({
        mutationFn: async () => {
            if (!coverImage || !title || !content || !authorId)
                throw new Error("Please fill all required fields");

            // Find the author name from the ID
            const selectedAuthor = authors.find(a => a.id.toString() === authorId);
            if (!selectedAuthor) throw new Error("Author not found");

            const res = await fetch(`${SERVER_URL}/api/createBlogPost`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    coverImage,
                    title,
                    content,
                    author: selectedAuthor.name,  // Send author name instead of ID
                    categories: selectedCategories,
                }),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            return data.post;
        },
        onSuccess: () => {
            toast.success("Blog post created successfully!");
            // Clear form
            setCoverImage("");
            setTitle("");
            setContent("");
            setAuthorId("");
            setSelectedCategories([]);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create blog post");
        },
    });

    // Mutation to add new category
    const {mutate: addCategory, isPending: addingCategory} = useMutation({
        mutationFn: async () => {
            if (!newCategory.trim()) throw new Error("Category name required");

            const res = await fetch(`${SERVER_URL}/api/addCategory`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name: newCategory}),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            return data.category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            setNewCategory("");
            setIsAddCategoryOpen(false);
        },
    });

    // Mutation to add new author
    const {mutate: addAuthor, isPending: addingAuthor} = useMutation({
        mutationFn: async () => {
            if (!newAuthorName.trim()) throw new Error("Author name required");

            const res = await fetch(`${SERVER_URL}/api/addAuthor`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({name: newAuthorName}),
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error);

            return data.author;
        },
        onSuccess: (author) => {
            queryClient.invalidateQueries({queryKey: ["authors"]});
            setAuthorId(author.id.toString());
            setNewAuthorName("");
            setIsAddAuthorOpen(false);
        },
    });

    return (
        <AdminLayout path="/admin/blog/create-post">
            <div className="flex flex-col gap-4 w-full py-4">
                <h1 className="text-2xl font-bold">Create Blog Post</h1>

                {/* Cover Image Picker */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Cover Image</label>
                    {coverImage && (
                        <img
                            src={coverImage}
                            alt="Cover Preview"
                            className="w-48 h-32 object-cover rounded border"
                        />
                    )}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                {coverImage ? "Change Cover Image" : "Select Cover Image"}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Select a Cover Image</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                                {coverImages.map((imgUrl, idx) => (
                                    <img
                                        key={idx}
                                        src={imgUrl}
                                        alt={`cover-${idx}`}
                                        className={`w-full h-32 object-cover rounded cursor-pointer border-2 transition 
                                            ${coverImage === imgUrl ? "border-blue-500" : "border-transparent"}`}
                                        onClick={() => setCoverImage(imgUrl)}
                                    />
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/*<Textarea*/}
                {/*    placeholder="Content (Markdown/HTML)"*/}
                {/*    value={content}*/}
                {/*    onChange={(e) => setContent(e.target.value)}*/}
                {/*    className="h-40"*/}
                {/*/>*/}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Content</label>
                    <TiptapEditor placeholder="Write something amazing..."
                                  content={content}
                                  onUpdate={(html) => setContent(html)} />
                    <div className="mt-4">
                        <h2 className="font-semibold">Output HTML:</h2>
                        <pre>{content}</pre>
                    </div>
                </div>
                {/* Author Select */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Author</label>
                    <div className="flex gap-2">
                        <Select value={authorId} onValueChange={setAuthorId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an author" />
                            </SelectTrigger>
                            <SelectContent>
                                {authors.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground text-center">
                                        No authors available
                                    </div>
                                ) : (
                                    authors.map((author) => (
                                        <SelectItem key={author.id} value={author.id.toString()}>
                                            {author.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Dialog open={isAddAuthorOpen} onOpenChange={setIsAddAuthorOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="default">
                                    + Add Author
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Author</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        placeholder="Author Name"
                                        value={newAuthorName}
                                        onChange={(e) => setNewAuthorName(e.target.value)}
                                    />
                                    <Button
                                        onClick={() => addAuthor()}
                                        disabled={addingAuthor}
                                    >
                                        {addingAuthor ? "Adding..." : "Add Author"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Categories multi-select with add option */}
                <div>
                    <label className="text-sm font-medium">Categories</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={selectedCategories.includes(cat.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                    setSelectedCategories((prev) =>
                                        prev.includes(cat.id)
                                            ? prev.filter((id) => id !== cat.id)
                                            : [...prev, cat.id]
                                    )
                                }
                            >
                                {cat.name}
                            </Button>
                        ))}

                        {/* Add Category Button */}
                        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    + Add Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Category</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        placeholder="Category Name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                    <Button
                                        onClick={() => addCategory()}
                                        disabled={addingCategory}
                                    >
                                        {addingCategory ? "Adding..." : "Add Category"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Button onClick={() => createPost()} disabled={isPending}>
                    {isPending ? "Creating..." : "Create Blog Post"}
                </Button>
            </div>
        </AdminLayout>
    );
}