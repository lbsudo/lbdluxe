import { ShopBackground } from "@/components/pages/Fitness/ShopBackground"
import { ShopHeader } from "@/components/pages/Fitness/ShopHeader"
import { ShopFooter } from "@/components/pages/Fitness/ShopFooter"

/**
 * The shop's own chrome. It deliberately shares nothing with
 * DefaultLayout — no ControlBar, no mobile nav, no MatrixBackground, no
 * main-site footer. The `dark` class makes `dark:` variants work inside
 * and `shop-theme` retunes every design token (dark neon glass, always
 * dark — the shop ignores the main site's light/dark toggle).
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="shop-theme dark relative flex min-h-screen w-full flex-col bg-background">
      <ShopBackground />
      <ShopHeader />
      <main className="relative z-10 flex w-full flex-1 flex-col">
        {children}
      </main>
      <ShopFooter />
    </div>
  )
}
