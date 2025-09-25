import {
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    KeyboardTriggeredDialog,
    KeyboardTriggeredDialogContent,
} from "../ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Layers, LibraryBig, SquareArrowOutUpRight } from "lucide-react";
import { LuGithub, LuLinkedin } from "react-icons/lu";
import { useRouter } from "@tanstack/react-router";
import {Separator} from "@/components/ui/separator.tsx";

export function ControlBarModal() {
    const router = useRouter();

    const dialogRoutes = [
        { label: "Shelf", path: "/shelf", icon: <LibraryBig size={24} className="size-5" /> },
        { label: "Stack", path: "/stack", icon: <Layers size={20} className="size-5" /> },
    ];

    const subdomains = [
        {
            label: "links.lbdluxe.com",
            icon: <SquareArrowOutUpRight size={20} />,
            onClick: () => window.open("https://links.lbdluxe.com", "_blank"),
        },
    ];

    const links = [
        {
            label: "Github",
            icon: <LuGithub size={24} className="size-5" />,
            onClick: () => window.open("https://github.com/your-handle", "_blank"),
        },
        {
            label: "LinkedIn",
            icon: <LuLinkedin size={24} className="size-5" />,
            onClick: () => window.open("https://linkedin.com/in/your-handle", "_blank"),
        },
    ];

    return (
        <>
            <KeyboardTriggeredDialog keyboardShortcut="k" modifierKey="meta">
                <DialogTrigger asChild>
                    <Button className="bg-neutral-800 text-xl rounded-md " variant="bar">
                        ⌥K
                    </Button>
                </DialogTrigger>

                <KeyboardTriggeredDialogContent className=" bg-neutral-300/10 backdrop-blur-4xl flex flex-col justify-start items-start rounded-xl h-max w-full max-w-lg">
                    <DialogTitle className="sr-only">Navigation Control Bar</DialogTitle>
                    <DialogDescription className="sr-only">
                        Website Navigation
                    </DialogDescription>

                    <Input
                        id="search"
                        type="text"
                        placeholder="Search..."
                        showSearchIcon={true}
                    />
                    <Separator orientation="horizontal" className=" bg-white" />

                    {/* 🔹 Routes */}
                    <div className="flex flex-col justify-start items-start w-full h-full px-2">
                        <p className="text-xl font-semibold">Routes</p>
                        {dialogRoutes.map(({ label, path, icon }) => (
                            <Button
                                key={path}
                                variant="bar"
                                className="flex flex-row justify-end items-center text-lg"
                                size="bar"
                                onClick={() => router.navigate({ to: path })}
                            >
                                {icon}
                                {label}
                            </Button>
                        ))}
                    </div>

                    <Separator orientation="horizontal" className="my-2 bg-white" />

                    {/* 🔹 Subdomains */}
                    <div className="flex flex-col justify-start items-start w-full h-full px-2">
                        <p className="text-xl font-semibold">Subdomains</p>
                        {subdomains.map(({ label, icon, onClick }) => (
                            <Button
                                key={label}
                                variant="bar"
                                className="flex flex-row justify-end items-center text-lg"
                                size="bar"
                                onClick={onClick}
                            >
                                {icon}
                                {label}
                            </Button>
                        ))}
                    </div>

                    <Separator orientation="horizontal" className="my-2 bg-white" />

                    {/* 🔹 Links */}
                    <div className="flex flex-col justify-start items-start w-full h-full px-2">
                        <p className="text-xl font-semibold">Links</p>
                        {links.map(({ label, icon, onClick }) => (
                            <Button
                                key={label}
                                variant="bar"
                                className="flex flex-row justify-end items-center text-lg"
                                size="bar"
                                onClick={onClick}
                            >
                                {icon}
                                {label}
                            </Button>
                        ))}
                    </div>
                </KeyboardTriggeredDialogContent>
            </KeyboardTriggeredDialog>
        </>
    );
}
