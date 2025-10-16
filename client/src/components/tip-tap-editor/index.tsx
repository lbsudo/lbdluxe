import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import TiptapStrike from "@tiptap/extension-strike";
import TiptapHighlight from "@tiptap/extension-highlight";
import TiptapLink from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import TiptapImage from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Undo,
    Redo,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    CodeXml,
    Link as LinkIcon,
    Highlighter,
    TextQuote,
    SquareCode,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify, ImageIcon, Check, X, Loader2,
} from "lucide-react";
import HeadingSelect from "@/components/tip-tap-editor/headingSelect.tsx";
import ListSelect from "@/components/tip-tap-editor/listSelect.tsx";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import '../../styles/tiptap.css'
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {common,createLowlight} from "lowlight";
import { useQuery } from "@tanstack/react-query";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

// Create a lowlight instance with common languages
const lowlight = createLowlight(common);

interface TiptapEditorProps {
    placeholder?: string;
    content?: string;
    onUpdate?: (html: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
                                                       placeholder,
                                                       content,
                                                       onUpdate,
                                                   }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
                bulletList: false,
                orderedList: false,
                listItem: false,
                codeBlock: false,
                strike: false,
            }),
            Placeholder.configure({ placeholder: placeholder || "Start typing..." }),
            BulletList.extend({
                content: "listItem+", // <- important
            }),
            OrderedList.extend({
                content: "listItem+", // <- important
            }),
            ListItem,
            TaskList,
            TaskItem.configure({ nested: true }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: 'javascript',
            }),
            TiptapUnderline,
            TiptapStrike,
            TiptapHighlight.configure({ multicolor: true }),
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TiptapImage.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'tiptap-image',
                    style: 'max-width: 100%; height: auto;',
                },
            }),
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onUpdate?.(html);
        },
    });

    const [currentHeadingLevel, setCurrentHeadingLevel] = useState(0);
    const [showImageInput, setShowImageInput] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedImage, setSelectedImage] = useState<string>("");

    // Fetch post images from Supabase
    const { data: postImages = [], isLoading: loadingImages } = useQuery<string[]>({
        queryKey: ["post-images"],
        queryFn: async () => {
            const res = await fetch(`${SERVER_URL}/api/listPostImages`);
            const json = await res.json();
            return json.images || [];
        },
        enabled: showImageInput, // Only fetch when the overlay is shown
    });

    // Update editor content when prop changes
    useEffect(() => {
        if (!editor || !content) return;

        // Only update if content is different to avoid infinite loops
        if (editor.getHTML() !== content) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if (!editor) return;

        const updateHeading = () => {
            const level =
                [1, 2, 3, 4].find((l) => editor.isActive("heading", { level: l })) || 0;
            setCurrentHeadingLevel(level);
        };

        editor.on("selectionUpdate", updateHeading);
        editor.on("transaction", updateHeading);
        editor.on("update", updateHeading);

        updateHeading();

        return () => {
            editor.off("selectionUpdate", updateHeading);
            editor.off("transaction", updateHeading);
            editor.off("update", updateHeading);
        };
    }, [editor]);

    if (!editor) return null;

    const activeClass = (active: boolean) => (active ? "bg-gray-200" : "");

    // ✅ Toggle logic — if same heading selected, remove it
    const handleHeadingToggle = (level: number) => {
        if (!editor) return;

        const isSameHeading = editor.isActive("heading", { level });
        if (isSameHeading) {
            editor.chain().focus().setParagraph().run();
        } else {
            editor.chain().focus().setNode("heading", { level }).run();
        }
    };

    // ✅ Handle link insertion
    const handleLinkToggle = () => {
        if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
        }

        const url = window.prompt("Enter URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

// ✅ Handle image button click
    const handleImageButtonClick = () => {
        setShowImageInput(true);
        setImageUrl("");
    };

    // ✅ Handle image insertion
    const handleImageInsert = () => {
        const urlToInsert = selectedImage || imageUrl;
        if (urlToInsert) {
            editor.chain().focus().setImage({ src: urlToInsert }).run();
            setShowImageInput(false);
            setImageUrl("");
            setSelectedImage("");
        }
    };

    // ✅ Handle cancel image insertion
    const handleCancelImage = () => {
        setShowImageInput(false);
        setImageUrl("");
    };

    // ✅ Handle image selection from grid
    const handleImageSelect = (url: string) => {
        setSelectedImage(url);
        setImageUrl(""); // Clear manual input when selecting from grid
    };

    return (
        <div className="tiptap-editor border rounded p-3">
            {/* Toolbar */}
            <div className="mb-2 flex flex-wrap gap-2 items-center">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo size={16} />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* ✅ Moved Heading Select here */}
                <HeadingSelect
                    editor={editor}
                    currentHeadingLevel={currentHeadingLevel}
                    onHeadingChange={handleHeadingToggle}
                />
                <ListSelect editor={editor} />
                
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={activeClass(editor.isActive("blockquote"))}
                >
                    <TextQuote size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={activeClass(editor.isActive("codeBlock"))}
                >
                    <SquareCode size={16} />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={activeClass(editor.isActive("bold"))}
                >
                    <Bold/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={activeClass(editor.isActive("italic"))}
                >
                    <Italic/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={activeClass(editor.isActive("underline"))}
                >
                    <Underline/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={activeClass(editor.isActive("strike"))}
                >
                    <Strikethrough/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={activeClass(editor.isActive("code"))}
                >
                    <CodeXml/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    className={activeClass(editor.isActive("highlight"))}
                >
                    <Highlighter/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLinkToggle}
                    className={activeClass(editor.isActive("link"))}
                >
                    <LinkIcon/>
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={activeClass(editor.isActive({ textAlign: 'left' }))}
                >
                    <AlignLeft size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={activeClass(editor.isActive({ textAlign: 'center' }))}
                >
                    <AlignCenter size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={activeClass(editor.isActive({ textAlign: 'right' }))}
                >
                    <AlignRight size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={activeClass(editor.isActive({ textAlign: 'justify' }))}
                >
                    <AlignJustify size={16} />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleImageButtonClick}
                    className={activeClass(showImageInput)}
                >
                    <ImageIcon size={16} />
                </Button>
            </div>

            {/* Editor Content with Image Selector Overlay */}
            <div className="relative overflow-hidden">
                <EditorContent editor={editor} className="tiptap-editor" />

                {/* Image Selector Overlay - Inside Editor */}
                {showImageInput && (
                    <div className="image-input-overlay">
                        <div className="image-selector-container">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <ImageIcon size={20} className="text-indigo-400" />
                                    <h3 className="text-lg font-semibold text-gray-100">Select an Image</h3>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancelImage}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    <X size={16} />
                                </Button>
                            </div>

                            {/* Image Grid */}
                            <div className="image-grid-container">
                                {loadingImages ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                                    </div>
                                ) : postImages.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        No images available. Upload some images first.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3">
                                        {postImages.map((imgUrl:any, idx:any) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleImageSelect(imgUrl)}
                                                className={`image-grid-item ${
                                                    selectedImage === imgUrl ? "selected" : ""
                                                }`}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`post-${idx}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {selectedImage === imgUrl && (
                                                    <div className="image-selected-badge">
                                                        <Check size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Manual URL Input */}
                            <div className="mt-4">
                                <p className="text-sm text-gray-400 mb-2">Or paste an image URL:</p>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        value={imageUrl}
                                        onChange={(e) => {
                                            setImageUrl(e.target.value);
                                            setSelectedImage(""); // Clear selection when typing
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleImageInsert();
                                            } else if (e.key === 'Escape') {
                                                handleCancelImage();
                                            }
                                        }}
                                        className="image-input-field"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    size="sm"
                                    onClick={handleImageInsert}
                                    disabled={!selectedImage && !imageUrl}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <Check size={16} className="mr-1" />
                                    Insert Image
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TiptapEditor;
