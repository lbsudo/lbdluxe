import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { List, ListOrdered, CheckSquare } from "lucide-react";
import { Editor } from "@tiptap/react";

interface ListSelectProps {
    editor: Editor;
}

const ListSelect: React.FC<ListSelectProps> = ({ editor }) => {
    const [activeListType, setActiveListType] = useState<string>("none");

    useEffect(() => {
        if (!editor) return;

        const updateActiveList = () => {
            const type = editor.isActive("bulletList")
                ? "bullet"
                : editor.isActive("orderedList")
                    ? "ordered"
                    : editor.isActive("taskList")
                        ? "task"
                        : "none";
            setActiveListType(type);
        };

        // Listen to cursor position changes
        editor.on("selectionUpdate", updateActiveList);
        editor.on("transaction", updateActiveList);
        editor.on("update", updateActiveList);

        // Initial check
        updateActiveList();

        // Cleanup listeners
        return () => {
            editor.off("selectionUpdate", updateActiveList);
            editor.off("transaction", updateActiveList);
            editor.off("update", updateActiveList);
        };
    }, [editor]);

    if (!editor) return null;

    // Icon to show based on active list
    const iconMap: Record<string, React.ElementType> = {
        none: List,
        bullet: List,
        ordered: ListOrdered,
        task: CheckSquare,
    };

    const Icon = iconMap[activeListType];

    const handleListToggle = (type: "bullet" | "ordered" | "task") => {
        const chain = editor.chain().focus();

        // If user selects the same list type → remove list
        if (
            (type === "bullet" && editor.isActive("bulletList")) ||
            (type === "ordered" && editor.isActive("orderedList")) ||
            (type === "task" && editor.isActive("taskList"))
        ) {
            chain.liftListItem("listItem").run();
            return;
        }

        switch (type) {
            case "bullet":
                chain.toggleBulletList().run();
                break;
            case "ordered":
                chain.toggleOrderedList().run();
                break;
            case "task":
                chain.toggleTaskList().run();
                break;
        }
    };

    return (
        <Select value={activeListType === "none" ? undefined : activeListType}>
            <SelectTrigger className="bg-neutral-600/50 w-16 flex items-center justify-center">
                <Icon
                    size={16}
                    className={activeListType === "none" ? "text-neutral-200" : "text-indigo-400"}
                />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    value="bullet"
                    onPointerDown={(e) => {
                        e.preventDefault();
                        handleListToggle("bullet");
                    }}
                >
                    Bullet List
                </SelectItem>
                <SelectItem
                    value="ordered"
                    onPointerDown={(e) => {
                        e.preventDefault();
                        handleListToggle("ordered");
                    }}
                >
                    Numbered List
                </SelectItem>
                <SelectItem
                    value="task"
                    onPointerDown={(e) => {
                        e.preventDefault();
                        handleListToggle("task");
                    }}
                >
                    Task List
                </SelectItem>
            </SelectContent>
        </Select>
    );
};

export default ListSelect;