import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import { PartnersList } from "../components/partners/PartnersList";
import QueryBoundary from "../components/common/QueryBoundary";

export const Route = createFileRoute("/parteneri")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <QueryBoundary>
      <PartnersList />
    </QueryBoundary>
  );
}
