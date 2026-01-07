import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/works')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/works"!</div>
}
