import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml' // for HTML
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import AdminLayout from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGetBlogPost } from "@/hooks/server/supabase/blog/GET/useGetBlogPost.ts";
import { useCreateBlogPost } from "@/hooks/server/supabase/blog/POST/useCreateBlogPost.ts";
import { useUpdateBlogPost } from "@/hooks/server/supabase/blog/PUT/useUpdateBlogPost.ts";
import { useUploadBlogImage } from "@/hooks/server/supabase/blog/POST/useUploadBlogImage.ts";
import { useUploadBlogCoverImage } from "@/hooks/server/supabase/blog/POST/useUploadBlogCoverImage.ts";
import { useMoveBlogCoverImage } from "@/hooks/server/supabase/blog/POST/useMoveBlogCoverImage.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import "@/styles/tiptap.css";
import { Undo, Redo, Bold, Italic, Underline as UnderlineIcon, Code, Quote, CodeSquare, Image as ImageIcon, Strikethrough as StrikethroughIcon, Highlighter, Superscript as SuperscriptIcon, Subscript as SubscriptIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuthors} from "@/hooks/server/supabase/blog/GET/useAuthors.ts";
import {useCategories} from "@/hooks/server/supabase/blog/GET/useCategories.ts";

export const Route = createFileRoute("/admin/content/blog-edit")({
  component: RouteComponent,
  validateSearch: (search) => ({
    id: search.id as number | undefined,
  }),
});

type BlogPostFormData = {
  cover_image: string;
  title: string;
  author: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const { id } = useSearch({ from: "/admin/content/blog-edit" });
  const [content, setContent] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalCoverImage, setOriginalCoverImage] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: blogPostResponse } = useGetBlogPost(id);
  const { data: authors, isLoading: authorsLoading } = useAuthors();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createBlogPostMutation = useCreateBlogPost({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      navigate({ to: "/admin/content/blog" });
    },
    onError: (error) => {
      toast.error("Failed to create blog post: " + error.message);
    },
  });
  const updateBlogPostMutation = useUpdateBlogPost({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      navigate({ to: "/admin/content/blog" });
    },
    onError: (error) => {
      toast.error("Failed to update blog post: " + error.message);
    },
  });
  const uploadBlogImageMutation = useUploadBlogImage({
    onSuccess: (data) => {
      if (data.success) {
        editor?.commands.setImage({ src: data.url });
        toast.success("Image inserted successfully");
      }
    },
    onError: (error) => {
      toast.error("Failed to upload image: " + error.message);
    },
  });
  const uploadBlogCoverImageMutation = useUploadBlogCoverImage({
    onSuccess: (data) => {
      if (data.success) {
        setValue("cover_image", data.url);
        toast.success("Cover image uploaded successfully");
      }
    },
    onError: (error) => {
      toast.error("Failed to upload cover image: " + error.message);
    },
  });

  const moveBlogCoverImageMutation = useMoveBlogCoverImage({
    onSuccess: (data) => {
      if (data.success) {
        setValue("cover_image", data.url);
        toast.success("Cover image moved to new folder");
      }
    },
    onError: (error) => {
      toast.error("Failed to move cover image: " + error.message);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<BlogPostFormData>();

  const lowlight = createLowlight(common)
  lowlight.register('typescript', typescript)
  lowlight.register('javascript', javascript)
  lowlight.register('css', css)
  lowlight.register('xml', xml) // HTML

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (blogPostResponse?.success) {
      const post = blogPostResponse.blogPost;
      setValue("cover_image", post.cover_image);
      setValue("title", post.title);
      setValue("author", post.author);
      setContent(post.content);
      editor?.commands.setContent(post.content);

      // Set selected author by finding matching name
      if (authors) {
        const authorMatch = authors.find((a: any) => a.name === post.author);
        if (authorMatch) {
          setSelectedAuthor(post.author); // Use name for validation
        } else {
          // Invalid author, reset to empty to show placeholder
          setSelectedAuthor("");
        }
      }

      // Set selected categories
      setSelectedCategories(post.tags || []);

      // Store original values for comparison
      setOriginalTitle(post.title);
      setOriginalCoverImage(post.cover_image);
    }
  }, [blogPostResponse, setValue, editor, authors]);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadBlogImageMutation.mutate(file);
      }
    };
    input.click();
  };

  const onSubmit = async (data: BlogPostFormData) => {
    console.log('selectedAuthor:', selectedAuthor, 'selectedCategories:', selectedCategories);

    // Validate selected author
    if (!selectedAuthor || !authors?.some((a: any) => a.name === selectedAuthor)) {
      toast.error("Please select a valid author.");
      return;
    }

    // Author is already the name
    const authorName = selectedAuthor;

    if (id) {
      // Check if title changed and we have a cover image that needs moving
      if (data.title !== originalTitle && data.cover_image && data.cover_image === originalCoverImage) {
        try {
          const moveResult = await moveBlogCoverImageMutation.mutateAsync({
            currentCoverImageUrl: originalCoverImage,
            newTitle: data.title,
          });
          
          if (moveResult.success) {
            // Use the new URL from the move operation
            data.cover_image = moveResult.url;
          }
        } catch (error) {
          // If move fails, continue with original URL but show error
          console.error("Failed to move cover image:", error);
        }
      }
      
      // Update
      updateBlogPostMutation.mutate({
        id,
        cover_image: data.cover_image,
        title: data.title,
        content,
        author: authorName,
        tags: selectedCategories,
      });
    } else {
      // Create
      createBlogPostMutation.mutate({
        cover_image: data.cover_image,
        title: data.title,
        content,
        author: authorName,
        tags: selectedCategories,
      });
    }
  };

  const isEditing = !!id;
  const isLoading = blogPostResponse?.success === false && id;

  if (isLoading) {
    return (
      <AdminLayout>
        <p className="text-muted-foreground">Loading blog post...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <Button variant="outline" onClick={() => navigate({ to: "/admin/content/blog" })}>
            Back to Blog Posts
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cover Image
                </label>
                {watch("cover_image") && (
                  <div className="mb-2">
                    <img
                      src={watch("cover_image")}
                      alt="Cover"
                      className="w-32 h-20 object-cover rounded border"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        uploadBlogCoverImageMutation.mutate({
                          file,
                          blogTitle: watch("title") || "untitled",
                        });
                      }
                    }}
                    disabled={uploadBlogCoverImageMutation.isPending}
                  />
                  {uploadBlogCoverImageMutation.isPending && <span>Uploading...</span>}
                </div>
                <input type="hidden" {...register("cover_image")} />
              </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Title *
              </label>
              <Input
                {...register("title", { required: "Title is required" })}
                placeholder="Blog post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Author *
              </label>
            <Select
              value={selectedAuthor}
              onValueChange={(value) => setSelectedAuthor(value || "")}
              disabled={authorsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue>Select an author...</SelectValue>
              </SelectTrigger>
                <SelectContent>
                {authors?.map((author: any) => (
                  <SelectItem key={author.id} value={author.name}>
                    {author.name}
                  </SelectItem>
                ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Categories
              </label>
              <div className="space-y-2">
                {categories?.map((categoryName: string) => (
                  <div key={categoryName} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${categoryName}`}
                      checked={selectedCategories.includes(categoryName)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, categoryName]);
                        } else {
                          setSelectedCategories(selectedCategories.filter(name => name !== categoryName));
                        }
                      }}
                    />
                    <label
                      htmlFor={`category-${categoryName}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {categoryName}
                    </label>
                  </div>
                ))}
                {categoriesLoading && <p className="text-muted-foreground">Loading categories...</p>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Content *
            </label>
            <div className="border rounded-md">
              <div className="border-b p-2 flex gap-1 flex-wrap items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  title="Undo"
                >
                  <Undo size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  title="Redo"
                >
                  <Redo size={16} />
                </Button>
                <span className="mx-2 text-muted-foreground">|</span>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 cursor-pointer">
                      {editor?.isActive('heading', { level: 1 }) ? 'H1' :
                       editor?.isActive('heading', { level: 2 }) ? 'H2' :
                       editor?.isActive('heading', { level: 3 }) ? 'H3' : 'P'}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().setParagraph().run()}
                      className={!editor?.isActive('heading') ? 'bg-muted' : ''}
                    >
                      Normal
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={editor?.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                    >
                      Heading 1
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                    >
                      Heading 2
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                      className={editor?.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
                    >
                      Heading 3
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 cursor-pointer">
                      {editor?.isActive('bulletList') ? '•' :
                       editor?.isActive('orderedList') ? '1.' : '—'}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().liftListItem('listItem').run()}
                      className={!editor?.isActive('bulletList') && !editor?.isActive('orderedList') ? 'bg-muted' : ''}
                    >
                      None
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={editor?.isActive('bulletList') ? 'bg-muted' : ''}
                    >
                      Bullet List
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={editor?.isActive('orderedList') ? 'bg-muted' : ''}
                    >
                      Ordered List
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={editor?.isActive('blockquote') ? 'bg-muted' : ''}
                  title="Blockquote"
                >
                  <Quote size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                  className={editor?.isActive('codeBlock') ? 'bg-muted' : ''}
                  title="Code Block"
                >
                  <CodeSquare size={16} />
                </Button>
                <span className="mx-2 text-muted-foreground">|</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={editor?.isActive('bold') ? 'bg-muted' : ''}
                  title="Bold"
                >
                  <Bold size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={editor?.isActive('italic') ? 'bg-muted' : ''}
                  title="Italic"
                >
                  <Italic size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={editor?.isActive('strike') ? 'bg-muted' : ''}
                  title="Strikethrough"
                >
                  <StrikethroughIcon size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleCode().run()}
                  className={editor?.isActive('code') ? 'bg-muted' : ''}
                  title="Inline Code"
                >
                  <Code size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={editor?.isActive('underline') ? 'bg-muted' : ''}
                  title="Underline"
                >
                  <UnderlineIcon size={16} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 cursor-pointer ${editor?.isActive('highlight') ? 'bg-muted' : ''}`}>
                      <Highlighter size={16} />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().unsetHighlight().run()}
                    >
                      None
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().setHighlight({ color: '#fbbf24' }).run()}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
                        Yellow
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().setHighlight({ color: '#a855f7' }).run()}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#a855f7' }}></div>
                        Purple
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().setHighlight({ color: '#f87171' }).run()}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f87171' }}></div>
                        Red
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().setHighlight({ color: '#3b82f6' }).run()}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                        Blue
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => editor?.chain().focus().setHighlight({ color: '#34d399' }).run()}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#34d399' }}></div>
                        Green
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = prompt('Enter link URL:');
                    if (url) {
                      editor?.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  className={editor?.isActive('link') ? 'bg-muted' : ''}
                  title="Link"
                >
                  <LinkIcon size={16} />
                </Button>
                <span className="mx-2 text-muted-foreground">|</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleSuperscript().run()}
                  className={editor?.isActive('superscript') ? 'bg-muted' : ''}
                  title="Superscript"
                >
                  <SuperscriptIcon size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().toggleSubscript().run()}
                  className={editor?.isActive('subscript') ? 'bg-muted' : ''}
                  title="Subscript"
                >
                  <SubscriptIcon size={16} />
                </Button>
                <span className="mx-2 text-muted-foreground">|</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  className={editor?.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
                  title="Align Left"
                >
                  <AlignLeft size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  className={editor?.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
                  title="Align Center"
                >
                  <AlignCenter size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  className={editor?.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
                  title="Align Right"
                >
                  <AlignRight size={16} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                  className={editor?.isActive({ textAlign: 'justify' }) ? 'bg-muted' : ''}
                  title="Align Justify"
                >
                  <AlignJustify size={16} />
                </Button>
                <span className="mx-2 text-muted-foreground">|</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImageUpload}
                  disabled={uploadBlogImageMutation.isPending}
                  title={uploadBlogImageMutation.isPending ? "Uploading..." : "Insert Image"}
                >
                  <ImageIcon size={16} />
                </Button>
              </div>
              <EditorContent
                editor={editor}
                className="p-4 min-h-[70vh]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/content/blog" })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBlogPostMutation.isPending || updateBlogPostMutation.isPending}
            >
              {createBlogPostMutation.isPending || updateBlogPostMutation.isPending
                ? (isEditing ? "Updating..." : "Creating...")
                : (isEditing ? "Update Post" : "Create Post")}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}