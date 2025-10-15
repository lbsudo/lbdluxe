import * as React from "react"
import { Link, useRouterState } from "@tanstack/react-router"

import { SearchForm } from "@/components/search-form"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Base Data",
            url: "/admin",
            items: [
                { title: "Home", url: "/admin" },
                { title: "Images", url: "/admin/images" },
                { title: "Newsletter Subs", url: "/admin/newsletter-subs" },
            ],
        },
        {
            title: "Site Content",
            url: "/admin/site-content",
            items: [
                { title: "Works", url: "/admin/works" },
                { title: "Products", url: "/admin/products" },
                { title: "Blog", url: "/admin/blog" },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname

    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SearchForm />
                <h1>Admin Panel</h1>
            </SidebarHeader>

            <SidebarContent>
                {/* Loop through main navigation groups */}
                {data.navMain.map((section) => (
                    <SidebarGroup key={section.title}>
                        <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {/* Loop through each link item */}
                                {section.items.map((item) => {
                                    const isActive =
                                        currentPath === item.url ||
                                        (item.url !== "/admin" && currentPath.startsWith(item.url))

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <Link to={item.url}>{item.title}</Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarRail />
        </Sidebar>
    )
}
