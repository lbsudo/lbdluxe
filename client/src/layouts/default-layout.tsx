import { Footer } from '@/components/Footer.tsx'
import { ThemeToggle } from '@/components/global/constants/theme/theme-toggle.tsx'
import { ControlBar } from '@/components/global/navigation/ControlBar.tsx'
import { MobileNavigation } from '@/components/global/navigation/MobileNavigation.tsx'
import MatrixBackground from "@/components/pages/matrix.tsx";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen relative">
      <MobileNavigation />
      <div className="relative z-20"><ControlBar /></div>
      <main className="flex-1 max-w-7xl pt-16 pb-16 flex flex-col items-center justify-center">
          <MatrixBackground/>
          <div className="fixed inset-0 bg-transparent dark:bg-black/75 pointer-events-none z-0"></div>
        <div className="justify-center items-center w-fit rounded-2xl bg-background/80 backdrop-blur-sm p-1 shadow-lg border hidden md:block fixed top-4 right-4">
          <ThemeToggle />
        </div>
        {children}
      </main>
      <Footer />
    </div>
  )
}
