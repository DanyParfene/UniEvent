import { createFileRoute } from '@tanstack/react-router'
import EventCardMain from '../components/events/EventCardMain'

export const Route = createFileRoute('/eveniment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><EventCardMain/></div>
}
