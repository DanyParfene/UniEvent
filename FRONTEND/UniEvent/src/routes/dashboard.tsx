import { createFileRoute } from '@tanstack/react-router'
import Bento from '../components/charts/Bento';
import Carousel from '../components/carousel/Carousel';
import EventList from '../components/events/EventList';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <>
      <Bento />
      <EventList/>
      <Carousel />
    </>
  );
}
