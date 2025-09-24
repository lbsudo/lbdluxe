import { createFileRoute } from '@tanstack/react-router'
import DefaultLayout from "@/layouts/default.tsx";

export const Route = createFileRoute('/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
      <DefaultLayout>
      Hello "/products"!
      </DefaultLayout>
      </>

}
