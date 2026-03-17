import { createFileRoute } from '@tanstack/react-router'
import { PartnersList } from '../components/partners/PartnersList'

export const Route = createFileRoute('/parteneri')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <PartnersList/>
  </>
}
