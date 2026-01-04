import { AppSidebar } from '@/components/AppSidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.tsx'

export default function AdminLayout({
  children,
  path,
}: {
  children: React.ReactNode
  path?: string
}) {
  // Generate breadcrumb items from path
  const generateBreadcrumbs = () => {
    if (!path) return []

    const segments = path.split('/').filter(Boolean)
    const breadcrumbs = []

    for (let i = 0; i < segments.length; i++) {
      const href = '/' + segments.slice(0, i + 1).join('/')
      const label = segments[i]
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        href,
        label,
        isLast: i === segments.length - 1,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="px-4">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="contents">
                    <BreadcrumbItem
                      className={index === 0 ? 'hidden md:block' : ''}
                    >
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!crumb.isLast && (
                      <BreadcrumbSeparator
                        className={index === 0 ? 'hidden md:block' : ''}
                      />
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
