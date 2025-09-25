import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useRouter} from "@tanstack/react-router";
import {MobileNavDrawer} from "@/components/global/mobile-nav-drawer.tsx";
import {motion, AnimatePresence} from "framer-motion";

export function MobileNavigation() {
    const [isOpen, setIsOpen] = useState(false);
    // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    console.log('hellp')
    const router = useRouter();

    const mainRoutes = [
        {label: "Home", path: "/"},
        {label: "Works", path: "/works"},
        {label: "Products", path: "/products"},
        {label: "Blog", path: "/blog"},
    ];

    return (
        <>
            <div
                className="fixed md:hidden top-0 left-0 w-full h-full bg-transparent backdrop-blur-3xl z-50 flex flex-col justify-start items-start p-2">
                {/*<div className={'w-max flex flex-col justify-start items-start'}>*/}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-8 h-8 flex flex-col justify-center items-center"
                >
                    {/* Top line */}
                    <span
                        className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                            isOpen ? "rotate-45" : "-translate-y-1.5"
                        }`}
                    />
                    {/* Bottom line */}
                    <span
                        className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                            isOpen ? "-rotate-45" : "translate-y-1.5"
                        }`}
                    />
                </button>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{height: 0, opacity: 0}}
                            animate={{height: "auto", opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            transition={{duration: 0.4, ease: [0.25, 0.8, 0.25, 1]}}
                            className="flex flex-col justify-start items-start gap-4 w-full overflow-hidden mt-4"
                        >
                            {/*<div className={'flex flex-col justify-start items-start mt-4 gap-4 w-full'}>*/}
                            {mainRoutes.map(({label, path}) => (
                                <Button
                                    key={path}
                                    onClick={() => router.navigate({to: path})}
                                    className="text-3xl px-1 font-medium"
                                    variant="bar"
                                >
                                    {label}
                                </Button>
                            ))}
                            <MobileNavDrawer/>
                            {/*</div>*/}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
