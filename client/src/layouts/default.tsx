import {ControlBar} from "@/components/global/navigation/control-bar.tsx";
import {MobileNavigation} from "@/components/global/navigation/mobile-navigation.tsx";
import {Footer} from "@/components/footer.tsx";
import {ThemeToggle} from "@/components/global/constants/theme-toggle.tsx";

export default function DefaultLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-start items-center h-screen">
            <MobileNavigation/>
            <ControlBar/>
            <main className=" max-w-7xl pt-16 ">
                <div className="justify-center items-center w-fit rounded-2xl bg-background/80 backdrop-blur-sm p-1 shadow-lg border hidden md:block fixed top-4 right-4">
                    <ThemeToggle />
                </div>
                    {children}
            </main>
            <Footer/>
        </div>
    );
}
