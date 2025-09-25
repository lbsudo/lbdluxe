import {Button} from "@/components/ui/button.tsx";
import {useRouter,useRouterState} from "@tanstack/react-router";
import {DialogDescription, DialogTrigger, KeyboardTriggeredDialog, KeyboardTriggeredDialogContent} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Layers, LibraryBig, SquareArrowOutUpRight} from "lucide-react";
import {LuGithub, LuLinkedin} from "react-icons/lu";
import {DialogTitle} from "@/components/ui/dialog.tsx";

export function ControlBar() {
    const { location } = useRouterState()
    const pathname = location.pathname;
    const router = useRouter()

    return (
        <>
            <div className="inset-x-0 bottom-0 z-10 mb-12 hidden w-full items-center justify-center md:flex lg:fixed">
                <div className={"flex w-fit items-center justify-center rounded-md py-1.5 px-1.5 bg-neutral-800 border border-neutral-500 "}>

            <Button onClick={() => router.navigate({ to: '/' })} className={pathname === "/"
                ? "bg-white text-xl text-black rounded-md"
                : "bg-neutral-800 text-xl rounded-md rounded-r-none backdrop-blur-2xl "} variant={'bar'}>
                Home
            </Button>
            <Button onClick={() => router.navigate({ to: '/works' })} className={pathname === "/works"
                ? "bg-white text-xl text-black  rounded-md "
                : "bg-neutral-800 text-xl  rounded-md backdrop-blur-2xl"} variant={'bar'}>
                Works
            </Button>
            <Button onClick={() => router.navigate({ to: '/products' })} className={pathname === "/products"
                ? "bg-white text-xl text-black  rounded-md "
                : "bg-neutral-800 text-xl  rounded-md backdrop-blur-2xl"} variant={'bar'}>
                Products
            </Button>
            <Button onClick={() => router.navigate({ to: '/blog' })} className={pathname === "/blog"
                ? "bg-white text-xl text-black  rounded-md "
                : "bg-neutral-800 text-xl rounded-md backdrop-blur-2xl"} variant={'bar'}>
                Blog
            </Button>

                    <KeyboardTriggeredDialog keyboardShortcut="k" modifierKey="meta">
                        <DialogTrigger asChild>
                            <Button className={"bg-neutral-800 text-xl rounded-md "} variant={'bar'}>⌥K</Button>
                        </DialogTrigger>

                        <KeyboardTriggeredDialogContent className=" bg-neutral-300/10 backdrop-blur-4xl flex flex-col justify-start items-start rounded-xl h-max w-full max-w-lg">
                            <DialogTitle className={'sr-only'}>
                                Navigation Control Bar
                            </DialogTitle>
                            <DialogDescription className={'sr-only'}>
                                Website Navigation
                            </DialogDescription>
                            <Input id={'search'} type="text" placeholder="Search..." showSearchIcon={true}/>
                            <Separator orientation={'horizontal'} className={' bg-white'}/>
                            <div className={'flex flex-col justify-start items-start w-full h-full px-2'}>
                                <p className={'text-xl font-semibold'}>Routes</p>
                                <Button variant={'bar'} className={'flex flex-row justify-end items-center text-lg'} size={'bar'} onClick={() => router.navigate({to: '/shelf'})}>  <LibraryBig size={24} className={'size-5'}  />Shelf</Button>
                                <Button variant={'bar'} className={'flex flex-row justify-end items-center text-lg'} size={'bar'} onClick={() => router.navigate({to: '/stack'})}>  <Layers size={20} className={'size-5'} />Stack</Button>
                            </div>
                            <Separator orientation={'horizontal'} className={'my-2 bg-white'}/>
                            <div className={'flex flex-col justify-start items-start w-full h-full px-2'}>
                                <p className={'text-xl font-semibold'}>Subdomains</p>
                                <Button variant={'bar'} className={'flex flex-row justify-end items-center text-lg'} size={'bar'}>
                                <SquareArrowOutUpRight size={20} />
                                links.lbdluxe.com
                                </Button>
                            </div>
                            <Separator orientation={'horizontal'} className={'my-2 bg-white'}/>
                            <div className={'flex flex-col justify-start items-start w-full h-full px-2'}>
                                <p className={'text-xl font-semibold'}>Links</p>
                                <Button variant={'bar'} className={'flex flex-row justify-end items-center text-lg'} size={'bar'}>
                                    <LuGithub size={'24'} className={'size-5'}/>
                                    Github
                                </Button>
                                <Button variant={'bar'} className={'flex flex-row justify-end items-center text-lg'} size={'bar'}>
                                    <LuLinkedin size={'24'} className={'size-5'}/>
                                    LinkedIn
                                </Button>
                            </div>
                        </KeyboardTriggeredDialogContent>
                    </KeyboardTriggeredDialog>
                </div>
            </div>
        </>
    )}
