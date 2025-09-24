import {Button} from "@/components/ui/button.tsx";
import {useRouter,useRouterState} from "@tanstack/react-router";

export function ControlBar() {
    const { location } = useRouterState()
    const pathname = location.pathname;
    const router = useRouter()

    return (
        <>
            <div className="inset-x-0 bottom-0 z-10 mb-12 hidden w-full items-center justify-center md:flex lg:fixed">
            <Button onClick={() => router.navigate({ to: '/' })} className={pathname === "/"
                ? "bg-white text-xl text-black backdrop-blur-2xl rounded-l-xl rounded-r-none"
                : "bg-neutral-200/10 text-xl backdrop-blur-2xl rounded-l-xl rounded-r-none"} variant={'bar'}>Home</Button>
            <Button onClick={() => router.navigate({ to: '/works' })} className={pathname === "/work"
                ? "bg-white text-xl text-black backdrop-blur-2xl rounded-none"
                : "bg-neutral-200/10 text-xl backdrop-blur-2xl rounded-none"} variant={'bar'}>Works</Button>
            <Button onClick={() => router.navigate({ to: '/products' })} className={pathname === "/products"
                ? "bg-white text-xl text-black backdrop-blur-2xl rounded-none"
                : "bg-neutral-200/10 text-xl backdrop-blur-2xl rounded-none"} variant={'bar'}>Products</Button>
            <Button onClick={() => router.navigate({ to: '/blog' })} className={pathname === "/blog"
                ? "bg-white text-xl text-black backdrop-blur-2xl rounded-none"
                : "bg-neutral-200/10 text-xl backdrop-blur-2xl rounded-none"} variant={'bar'}>Blog</Button>
            <Button className={"bg-neutral-200/10 text-2xl backdrop-blur-2xl rounded-r-xl rounded-l-none"} variant={'bar'}>K</Button>
            </div>
        </>
    )}
