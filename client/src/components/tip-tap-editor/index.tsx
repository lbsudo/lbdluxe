import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {Undo, Redo, Bold, Italic, Underline, Strikethrough, CodeXml, Link, Highlighter} from "lucide-react";
import HeadingSelect from "@/components/tip-tap-editor/headingSelect.tsx";
import ListSelect from "@/components/tip-tap-editor/listSelect.tsx";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import '../../styles/tiptap.css'

interface TiptapEditorProps {
    placeholder?: string;
    content?: string;
    onUpdate?: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
                                                       placeholder,
                                                       content,
                                                   }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4] },
                bulletList: false,
                orderedList: false,
                listItem: false,
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
        ],
        content: content || "",
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

                <div className="w-px h-6 bg-gray-300 mx-1" />
                {/* Other toolbar buttons */}
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
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={activeClass(editor.isActive("underline"))}
                >
<Strikethrough/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={activeClass(editor.isActive("underline"))}
                >
<CodeXml/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={activeClass(editor.isActive("underline"))}
                >
                    <Highlighter/>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={activeClass(editor.isActive("underline"))}
                >
<Link/>
                </Button>

            </div>



            <EditorContent editor={editor} className="tiptap-editor" />
        </div>
    );
};

export default TiptapEditor;
