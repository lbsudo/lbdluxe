import {ControlBar} from "@/components/global/control-bar.tsx";
import {MobileNavigation} from "@/components/global/mobile-navigation.tsx";
import {Footer} from "@/components/global/footer.tsx";

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
            <Footer/>
        </div>
    );
}
