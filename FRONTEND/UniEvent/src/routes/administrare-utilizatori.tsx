import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import UsersList from "../components/account/UsersList";
import QueryBoundary from "../components/common/QueryBoundary";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export const Route = createFileRoute("/administrare-utilizatori")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.current_role !== "super_administrator") {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [user, navigate]);

  if (!user || user.current_role !== "super_administrator") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-4xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col h-auto">
        <div className="w-full max-w-7xl mb-8 flex items-center flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight">
            Administrare Utilizatori
          </h1>
          <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
        </div>

        <QueryBoundary>
          <UsersList />
        </QueryBoundary>
      </div>
    </div>
  );
}
