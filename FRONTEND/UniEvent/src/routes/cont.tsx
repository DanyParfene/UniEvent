import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import UserCard from "../components/account/UserCard";
import QueryBoundary from "../components/common/QueryBoundary";

export const Route = createFileRoute("/cont")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <QueryBoundary>
        <UserCard />
      </QueryBoundary>
    </div>
  );
}
