import { Layers, LibraryBig, SquareArrowOutUpRight } from 'lucide-react'
import { LuGithub, LuLinkedin } from 'react-icons/lu'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export function ControlBarModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // ⌥K (Option+K / Alt+K) global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Mac Option = Alt on Windows keyboards
      if (e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev) // toggle dialog
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const dialogRoutes = [
    { label: 'Shelf', path: '/shelf', icon: <LibraryBig className="size-5" /> },
    { label: 'Stack', path: '/stack', icon: <Layers className="size-5" /> },
  ]

  const subdomains = [
    {
      label: 'links.lbdluxe.com',
      icon: <SquareArrowOutUpRight className="size-5" />,
      onClick: () => window.open('https://links.lbdluxe.com', '_blank'),
    },
  ]

  const links = [
    {
      label: 'Github',
      icon: <LuGithub className="size-5" />,
      onClick: () => window.open('https://github.com/your-handle', '_blank'),
    },
    {
      label: 'LinkedIn',
      icon: <LuLinkedin className="size-5" />,
      onClick: () =>
        window.open('https://linkedin.com/in/your-handle', '_blank'),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>⌥K</DialogTrigger>

      <DialogContent className="bg-neutral-700/50 backdrop-blur-xl flex flex-col rounded-xl w-full max-w-lg">
        <DialogTitle className="sr-only">Navigation Control Bar</DialogTitle>
        <DialogDescription className="sr-only">
          Website Navigation
        </DialogDescription>

        <Input id="search" type="text" placeholder="Search..." />
        <Separator className="bg-white my-2" />

        {/* Routes */}
        <div className="flex flex-col px-2">
          <p className="text-xl font-semibold">Routes</p>
          {dialogRoutes.map(({ label, path, icon }) => (
            <Button
              key={path}
              variant="bar"
              size="bar"
              className="flex flex-row items-center text-lg"
              onClick={() => router.navigate({ to: path })}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>

        <Separator className="bg-white my-2" />

        {/* Subdomains */}
        <div className="flex flex-col px-2">
          <p className="text-xl font-semibold">Subdomains</p>
          {subdomains.map(({ label, icon, onClick }) => (
            <Button
              key={label}
              variant="bar"
              size="bar"
              className="flex flex-row items-center text-lg"
              onClick={onClick}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>

        <Separator className="bg-white my-2" />

        {/* Links */}
        <div className="flex flex-col px-2">
          <p className="text-xl font-semibold">Links</p>
          {links.map(({ label, icon, onClick }) => (
            <Button
              key={label}
              variant="bar"
              size="bar"
              className="flex flex-row items-center text-lg"
              onClick={onClick}
            >
              {icon}
              {label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
