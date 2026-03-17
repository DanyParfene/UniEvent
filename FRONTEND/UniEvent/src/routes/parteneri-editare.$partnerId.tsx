import { createFileRoute } from "@tanstack/react-router";
import { PartnersList } from "../components/partners/PartnersList";

export const Route = createFileRoute("/parteneri-editare/$partnerId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { partnerId } = Route.useParams();
  return (
    <>
      <PartnersList isAdminMode={true} isEditMode={true} editPartnerId={Number(partnerId)}/>
    </>
  );
}
