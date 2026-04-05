import { createFileRoute } from '@tanstack/react-router'
import Bento from '../components/charts/Bento';
import Carousel from '../components/carousel/Carousel';
import EventList from '../components/events/EventList';
import nokiaLogo from '../assets/nokia_logo.png';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const mockBentoData = {
    upcomingEvents: ["Conferința Tech", "Gala UVT", "Hackathon 2026", "Open Days", "Târg de Joburi"],
    topOrganiser: "Ion Vasile",
    topSponsorLogo: nokiaLogo, 
    pressAppearances: 2000,
    maxParticipants: 5000,
    chartData: [
      { name: "Ian", value: 400 },
      { name: "Feb", value: 300 },
      { name: "Mar", value: 300 },
      { name: "Apr", value: 50 },
      { name: "Mai", value: 300 },
      { name: "Iun", value: 150 },
    ],
  };
  return(
    <>
      <Bento stats={mockBentoData}/>
      <EventList/>
      <Carousel />
    </>
  );
}
