import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import Header from "../components/shared/Header";
import { useAuth } from "../context/AuthContext";
import { waitForReady } from "../lib/auth-store";

const PUBLIC_PATHS = ["/conectare", "/inregistrare", "/recuperare-parola"];

const Spinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
  </div>
);

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (isLoading) return;
    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    if (!isAuthenticated && !isPublic) {
      navigate({ to: "/conectare", replace: true });
    }
  }, [isAuthenticated, isLoading, pathname, navigate]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Header />
      <Outlet />
    </div>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async () => {
    await waitForReady();
  },
  component: RootLayout,
});
