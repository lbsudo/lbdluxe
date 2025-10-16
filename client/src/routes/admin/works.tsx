import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/works')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/works"!</div>
}
