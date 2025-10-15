import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { Heading, Heading1, Heading2, Heading3, Heading4 } from "lucide-react";
import { Editor } from "@tiptap/react";

interface HeadingSelectProps {
    editor: Editor;
    currentHeadingLevel: number;
    onHeadingChange: (level: number) => void;
}

const HeadingSelect: React.FC<HeadingSelectProps> = ({
                                                         editor,
                                                         currentHeadingLevel,
                                                         onHeadingChange,
                                                     }) => {
    if (!editor) return null;

    const headingIconMap: Record<number, React.ElementType> = {
        1: Heading1,
        2: Heading2,
        3: Heading3,
        4: Heading4,
    };

    const HeadingIcon =
        currentHeadingLevel === 0 ? Heading : headingIconMap[currentHeadingLevel];

    return (
        <Select value={currentHeadingLevel === 0 ? undefined : currentHeadingLevel.toString()}>
            <SelectTrigger className={`bg-neutral-600/50 w-16 flex items-center justify-center`}>
                <HeadingIcon size={16} className={`${currentHeadingLevel === 0 ? "text-neutral-200": "text-indigo-500"}`} />
            </SelectTrigger>
            <SelectContent>
                {[1, 2, 3, 4].map((level) => (
                    <SelectItem
                        key={level}
                        value={level.toString()}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            onHeadingChange(level);
                        }}
                    >
                        H{level}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default HeadingSelect;
