import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import {
    Undo,
    Redo,
    Heading,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
} from "lucide-react";

interface TiptapEditorProps {
    placeholder?: string;
    content?: string;
    onUpdate?: (content: string) => void;
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
            }),
            Placeholder.configure({
                placeholder: placeholder || "Start typing...",
            }),
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            if (onUpdate) onUpdate(editor.getHTML());
        },
    });

    const [currentHeadingLevel, setCurrentHeadingLevel] = useState(0);

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

    const headingIconMap: Record<number, React.ElementType> = {
        1: Heading1,
        2: Heading2,
        3: Heading3,
        4: Heading4,
    };

    const HeadingIcon =
        currentHeadingLevel === 0 ? Heading : headingIconMap[currentHeadingLevel];

    return (
        <div className="tiptap-editor border rounded p-3">
            {/* Toolbar */}
            <div className="mb-2 flex flex-wrap gap-2 items-center">
                {/* Undo / Redo */}
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

                {/* Heading dropdown */}
                <Select
                    value={currentHeadingLevel === 0 ? undefined : currentHeadingLevel.toString()}
                >
                    <SelectTrigger className="w-28 flex items-center justify-center">
                        <HeadingIcon size={16} className="text-gray-700" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4].map((level) => (
                            <SelectItem
                                key={level}
                                value={level.toString()}
                                // 👇 pointerDown fires even if same value is reselected
                                onPointerDown={(e) => {
                                    e.preventDefault();
                                    handleHeadingToggle(level);
                                }}
                            >
                                H{level}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Text styles */}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={activeClass(editor.isActive("bold"))}
                >
                    Bold
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={activeClass(editor.isActive("italic"))}
                >
                    Italic
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={activeClass(editor.isActive("underline"))}
                >
                    Underline
                </Button>

                {/* Lists */}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={activeClass(editor.isActive("bulletList"))}
                >
                    Bullet List
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={activeClass(editor.isActive("orderedList"))}
                >
                    Numbered List
                </Button>
            </div>

            {/* Inline styles */}
            <style>
                {`
          .tiptap-editor { white-space: pre-wrap; }
          .tiptap-editor p { margin-bottom: 1em; }
          .tiptap-editor h1 { font-size: 2rem; font-weight: bold; }
          .tiptap-editor h2 { font-size: 1.5rem; font-weight: bold; }
          .tiptap-editor h3 { font-size: 1.25rem; font-weight: bold; }
          .tiptap-editor h4 { font-size: 1rem; font-weight: bold; }
          .tiptap-editor strong { font-weight: bold; }
          .tiptap-editor em { font-style: italic; }
          .tiptap-editor ul, .tiptap-editor ol {
            padding-left: 1.5rem;
            margin-bottom: 1em;
          }
        `}
            </style>

            <EditorContent editor={editor} className="tiptap-editor" />
        </div>
    );
};

export default TiptapEditor;
