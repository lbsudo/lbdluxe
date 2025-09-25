import {ControlBar} from "@/components/global/control-bar.tsx";
import {MobileNavigation} from "@/components/global/mobile-navigation.tsx";

export default function DefaultLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-start items-center h-screen">
            <MobileNavigation/>
            <ControlBar/>
            <main className="h-full max-w-7xl pt-16 mb-40">
                {children}
            </main>
            {/*<footer className="w-full flex items-end justify-center my-3 fixed bottom-0">*/}
            {/*    <a*/}
            {/*        className="flex items-center gap-1 text-current"*/}
            {/*        href="https://heroui.com"*/}
            {/*        title="heroui.com homepage"*/}
            {/*    >*/}
            {/*        <span className="text-default-600">Powered by</span>*/}
            {/*        <p className="text-primary">HeroUI</p>*/}
            {/*    </a>*/}
            {/*</footer>*/}
        </div>
    );
}
