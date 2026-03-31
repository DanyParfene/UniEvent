import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import Header from "../components/shared/Header";
import Carousel from "../components/carousel/Carousel";
import EventCard from "../components/events/EventCard";
import Bento from "../components/charts/Bento";

const RootLayout = () => {
  return (
    <div className="flex flex-col jusify-center items-center">
      <Header />
      <Bento/>
      <div className="flex flex-col w-full items-center gap-5 mb-30">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
      <Carousel />
      <Outlet />;
    </div>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootLayout,
});
