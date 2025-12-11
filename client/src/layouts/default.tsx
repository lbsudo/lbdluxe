import {ControlBar} from "@/components/global/navigation/control-bar.tsx";
import {MobileNavigation} from "@/components/global/navigation/mobile-navigation.tsx";
import {Footer} from "@/components/footer.tsx";

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
                {children}
            </main>
            <Footer/>
        </div>
    );
}
