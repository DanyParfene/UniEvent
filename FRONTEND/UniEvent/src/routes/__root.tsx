import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import Header from "../components/shared/Header";
import Carousel from "../components/carousel/Carousel";

const RootLayout = () => {
  return (
    <div className="flex flex-col jusify-center items-center items-center">
      <Header/>
      <Carousel/>
      <Outlet />;
    </div>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
});
