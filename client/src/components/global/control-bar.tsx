import {Button} from "@/components/ui/button.tsx";
import {useRouter,useRouterState} from "@tanstack/react-router";
import {ControlBarModal} from "@/components/global/control-bar-modal.tsx";

export function ControlBar() {
    const { location } = useRouterState()
    const pathname = location.pathname;
    const router = useRouter()

    // 🔹 config arrays
    const mainRoutes = [
        { label: "Home", path: "/" },
        { label: "Works", path: "/works" },
        { label: "Products", path: "/products" },
        { label: "Blog", path: "/blog" },
    ];

    return (
        <>
            <div className="inset-x-0 bottom-0 z-10 mb-12 hidden w-full items-center justify-center md:flex md:fixed">
                <div className={"flex  items-center justify-center rounded-md py-1.5 px-1.5 bg-neutral-800 border border-neutral-500 "}>
                    {/* 🔹 Main nav buttons */}
                    {mainRoutes.map(({ label, path }) => (
                        <Button
                            key={path}
                            onClick={() => router.navigate({ to: path })}
                            className={
                                pathname === path
                                    ? "bg-white text-xl text-black rounded-md"
                                    : "bg-neutral-800 text-xl rounded-md backdrop-blur-2xl"
                            }
                            variant="bar"
                        >
                            {label}
                        </Button>
                    ))}
                    {/* 🔹 Keyboard dialog */}
                    <ControlBarModal/>
                </div>
            </div>
        </>
    )}
