import { createFileRoute } from '@tanstack/react-router'
import DefaultLayout from "@/layouts/default.tsx";

export const Route = createFileRoute('/blog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
      <DefaultLayout>
      Hello "/blog"!
      </DefaultLayout>
      </>
}
