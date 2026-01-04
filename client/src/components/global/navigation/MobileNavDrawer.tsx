import {
  Layers,
  LibraryBig,
  PanelTopClose,
  SquareArrowOutUpRight,
} from 'lucide-react'
import { useState } from 'react'
import { LuGithub, LuLinkedin } from 'react-icons/lu'
import { useRouter } from '@tanstack/react-router'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Separator } from '@/components/ui/separator.tsx'

export function MobileNavDrawer() {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const dialogRoutes = [
    {
      label: 'Shelf',
      path: '/shelf',
      icon: <LibraryBig size={24} className="size-5" />,
    },
    {
      label: 'Stack',
      path: '/stack',
      icon: <Layers size={20} className="size-5" />,
    },
  ]

  const subdomains = [
    {
      label: 'links.lbdluxe.com',
      icon: <SquareArrowOutUpRight size={20} />,
      onClick: () => window.open('https://links.lbdluxe.com', '_blank'),
    },
  ]

  const links = [
    {
      label: 'Github',
      icon: <LuGithub size={24} className="size-5" />,
      onClick: () => window.open('https://github.com/your-handle', '_blank'),
    },
    {
      label: 'LinkedIn',
      icon: <LuLinkedin size={24} className="size-5" />,
      onClick: () =>
        window.open('https://linkedin.com/in/your-handle', '_blank'),
    },
  ]

  return (
    <>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="bar"
            className="text-3xl px-1 font-medium"
            size={'icon'}
          >
            <PanelTopClose size={28} className={'size-8'} />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="p-4">
          <DrawerHeader>
            <DrawerTitle className={'sr-only'}>Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerContent className="flex flex-col gap-4 mt-4">
            <Input id="search" type="text" placeholder="Search..." />
            <Separator orientation="horizontal" className=" bg-white" />

            {/* 🔹 Routes */}
            <div className="flex flex-col justify-start items-start w-full h-full px-2">
              <p className="text-xl font-semibold">Routes</p>
              {dialogRoutes.map(({ label, path, icon }) => (
                <Button
                  key={path}
                  variant="bar"
                  className="flex flex-row justify-end items-center text-lg"
                  size="bar"
                  onClick={() => router.navigate({ to: path })}
                >
                  {icon}
                  {label}
                </Button>
              ))}
            </div>

            <Separator orientation="horizontal" className="my-2 bg-white" />

            {/* 🔹 Subdomains */}
            <div className="flex flex-col justify-start items-start w-full h-full px-2">
              <p className="text-xl font-semibold">Subdomains</p>
              {subdomains.map(({ label, icon, onClick }) => (
                <Button
                  key={label}
                  variant="bar"
                  className="flex flex-row justify-end items-center text-lg"
                  size="bar"
                  onClick={onClick}
                >
                  {icon}
                  {label}
                </Button>
              ))}
            </div>

            <Separator orientation="horizontal" className="my-2 bg-white" />

            {/* 🔹 Links */}
            <div className="flex flex-col justify-start items-start w-full h-full px-2">
              <p className="text-xl font-semibold">Links</p>
              {links.map(({ label, icon, onClick }) => (
                <Button
                  key={label}
                  variant="bar"
                  className="flex flex-row justify-end items-center text-lg"
                  size="bar"
                  onClick={onClick}
                >
                  {icon}
                  {label}
                </Button>
              ))}
            </div>
          </DrawerContent>
        </DrawerContent>
      </Drawer>
    </>
  )
}
