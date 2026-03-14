import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import EventCardMain from "../components/events/EventCardMain";

const RootLayout = () => {
  return (
    <>
      <Outlet />;
    </>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
});
