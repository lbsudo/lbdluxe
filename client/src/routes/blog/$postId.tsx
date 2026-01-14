import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/blog/$postId"!</div>
}
