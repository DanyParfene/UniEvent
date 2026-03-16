import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import Header from "../components/shared/Header";

const RootLayout = () => {
  return (
    <div className="flex flex-col jusify-center items-center items-center">
      <Header/>
      <Outlet />;
    </div>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
});
