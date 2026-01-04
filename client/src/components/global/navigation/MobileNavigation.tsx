import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button.tsx'
import { MobileNavDrawer } from '@/components/global/navigation/MobileNavDrawer.tsx'

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [isOpen])

  const mainRoutes = [
    { label: 'Home', path: '/' },
    { label: 'Works', path: '/works' },
    { label: 'Products', path: '/products' },
    { label: 'Blog', path: '/blog' },
  ]

  return (
    <div
      className={`fixed md:hidden top-0 left-0 w-full ${isOpen ? 'h-full' : ''}  backdrop-blur-3xl z-50 flex flex-col justify-start items-start p-2`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8 h-8 flex flex-col justify-center items-center ring-none focus:ring-0 focus:outline-none"
      >
        {/* Top line */}
        <span
          className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
            isOpen ? 'rotate-45' : '-translate-y-1.5'
          }`}
        />
        {/* Bottom line */}
        <span
          className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
            isOpen ? '-rotate-45' : 'translate-y-1.5'
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={contentRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: contentHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.5, 0.25, 1] }}
            className="flex flex-col justify-start items-start gap-4 w-full overflow-hidden mt-4"
          >
            {mainRoutes.map(({ label, path }) => (
              <Button
                key={path}
                onClick={() => router.navigate({ to: path })}
                className="text-3xl px-1 font-medium"
                variant="bar"
              >
                {label}
              </Button>
            ))}
            <MobileNavDrawer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
