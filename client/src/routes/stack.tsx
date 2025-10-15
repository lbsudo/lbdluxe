import { createFileRoute } from '@tanstack/react-router'
import DefaultLayout from "@/layouts/default.tsx";

export const Route = createFileRoute('/stack')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
      <DefaultLayout>
      Hello "/stack"!
      </DefaultLayout>
  </>
}
