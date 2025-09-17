import {Navbar} from "../components/global/navbar";

export default function DefaultLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col justify-start items-center h-screen">
            <Navbar/>
            <main className=" mx-auto h-full max-w-7xl px-6 pt-16">
                {children}
            </main>
            <footer className="w-full flex items-end justify-center py-3">
                <a
                    className="flex items-center gap-1 text-current"
                    href="https://heroui.com"
                    title="heroui.com homepage"
                >
                    <span className="text-default-600">Powered by</span>
                    <p className="text-primary">HeroUI</p>
                </a>
            </footer>
        </div>
    );
}
