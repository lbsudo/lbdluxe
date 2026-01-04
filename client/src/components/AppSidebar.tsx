import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";

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
} from "@/components/ui/sidebar";
import { SearchForm } from "@/components/ui/SearchForm";

const data = {
  navMain: [
    {
      title: "Base",
      url: "/admin",
      items: [
        { title: "Data", url: "/admin" },
        { title: "Profile", url: "/admin/base/profile" },
        { title: "Newsletter Subs", url: "/admin/base/newsletter-subs" },
      ],
    },
    {
      title: "Site Content",
      url: "/admin/site-content",
      items: [
        { title: "Works", url: "/admin/content/works" },
        { title: "Products", url: "/admin/content/products" },
        { title: "Blog", url: "/admin/content/blog" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

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
                    (item.url !== "/admin" && currentPath.startsWith(item.url));

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={isActive}>
                        <Link to={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
