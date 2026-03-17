import { createFileRoute } from '@tanstack/react-router'
import { PartnersList } from '../components/partners/PartnersList'

export const Route = createFileRoute('/parteneri-administrare')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <PartnersList isAdminMode={true}/>
  </>
}
