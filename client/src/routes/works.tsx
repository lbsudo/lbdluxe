import { createFileRoute } from '@tanstack/react-router'
import DefaultLayout from "@/layouts/default-layout.tsx";
import PageHeader from "@/components/global/page-header.tsx";

export const Route = createFileRoute('/works')({
  component: RouteComponent,
})

function RouteComponent() {
  return <><DefaultLayout>
<PageHeader/>
    </DefaultLayout></>
}
