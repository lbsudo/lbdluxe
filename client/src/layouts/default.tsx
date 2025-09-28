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
            <main className=" max-w-7xl pt-16 ">
                {children}
                {/*<div className={'h-px bg-gradient-to-r from-transparent via-white to-transparent'}/>*/}
            </main>
            <Footer/>
        </div>
    );
}
