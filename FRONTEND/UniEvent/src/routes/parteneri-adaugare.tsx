import { createFileRoute } from '@tanstack/react-router'
import { PartnersList } from '../components/partners/PartnersList'

export const Route = createFileRoute('/parteneri-adaugare')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <PartnersList isAdminMode={true} isAddMode={true}/>
  </>
}
