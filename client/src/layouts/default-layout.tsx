import { Footer } from '@/components/Footer.tsx'
import { ThemeToggle } from '@/components/global/constants/theme/theme-toggle.tsx'
import { ControlBar } from '@/components/global/navigation/ControlBar.tsx'
import { MobileNavigation } from '@/components/global/navigation/MobileNavigation.tsx'

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-start items-center w-screen h-screen">
      <MobileNavigation />
      <ControlBar />
      <main className=" max-w-7xl pt-16 ">
        <div className="justify-center items-center w-fit rounded-2xl bg-background/80 backdrop-blur-sm p-1 shadow-lg border hidden md:block fixed top-4 right-4">
          <ThemeToggle />
        </div>
        {children}
      </main>
      <Footer />
    </div>
  )
}
