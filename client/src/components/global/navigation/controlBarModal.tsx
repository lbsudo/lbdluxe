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
    { label: 'Shelf', path: '/shelf', icon: <LibraryBig className="size-5 ml-2" /> },
    { label: 'Stack', path: '/stack', icon: <Layers className="size-5 ml-2" /> },
  ]

  const subdomains = [
    {
      label: 'links.lbdluxe.com',
      icon: <SquareArrowOutUpRight className="size-5 ml-2" />,
      onClick: () => window.open('https://links.lbdluxe.com', '_blank'),
    },
  ]

  const links = [
    {
      label: 'Github',
      icon: <LuGithub className="size-5 ml-2" />,
      onClick: () => window.open('https://github.com/your-handle', '_blank'),
    },
    {
      label: 'LinkedIn',
      icon: <LuLinkedin className="size-5 ml-2" />,
      onClick: () =>
        window.open('https://linkedin.com/in/your-handle', '_blank'),
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={'px-2'}>⌥K</DialogTrigger>

        <DialogContent className="bg-neutral-700/50 font-switzer backdrop-blur-xl gap-0 p-0 flex flex-col items-start justify-start rounded-md w-full max-w-lg control-bar-modal">
        <DialogTitle className="sr-only">Navigation Control Bar</DialogTitle>
        <DialogDescription className="sr-only">
          Website Navigation
        </DialogDescription>

        <div className="relative w-full ">
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            className="w-full rounded-b-none backdrop-blur-none border-none outline-none focus-visible:border-none focus-visible:ring-transparent pb-2 bg-neutral-700/20"
          />
        </div>
        <Separator className="bg-white mb-2" />

        {/* Routes */}
        <p className="text-sm font-light px-2 ">Routes</p>
        <div className="flex flex-col justify-around items-start w-full text-left ">
{dialogRoutes.map(({ label, path, icon }) => (
              <Button
                key={path}
                variant="bar"
                size="bar"
                className="flex flex-row gap-2 rounded-md items-center justify-start text-md hover:bg-background w-full px-12"
                onClick={() => {
                  router.navigate({ to: path })
                  setOpen(false)
                }}
              >
                {icon}
                {label}
              </Button>
            ))}
        </div>

        <Separator className="bg-white my-2" />

        {/* Subdomains */}
          <p className="text-sm font-light px-2">Subdomains</p>
          <div className="flex flex-col justify-around items-start w-full text-left ">
{subdomains.map(({ label, icon, onClick: handleClick }) => (
                <Button
                  key={label}
                  variant="bar"
                  size="bar"
                  className="flex flex-row gap-2 rounded-md items-center justify-start text-md hover:bg-background w-full px-12"
                  onClick={() => {
                    handleClick()
                    setOpen(false)
                  }}
                >
                  {icon}
                  {label}
                </Button>
              ))}
        </div>

        <Separator className="bg-white my-2" />

        {/* Links */}
          <p className="text-sm font-light px-2">Links</p>
          <div className="flex flex-col justify-around items-start w-full text-left">
{links.map(({ label, icon, onClick: handleClick }) => (
                <Button
                  key={label}
                  variant="bar"
                  size="bar"
                  className="flex flex-row gap-2 rounded-md items-center justify-start text-md hover:bg-background w-full px-12"
                  onClick={() => {
                    handleClick()
                    setOpen(false)
                  }}
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
