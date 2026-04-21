import { createFileRoute } from "@tanstack/react-router";
import Bento from "../components/charts/Bento";
import Carousel from "../components/carousel/Carousel";
import EventList from "../components/events/EventList";
import nokiaLogo from "../assets/nokia_logo.png";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const mockBentoData = {
    upcomingEvents: [
      "Conferința Tech",
      "Gala UVT",
      "Hackathon 2026",
      "Open Days",
      "Târg de Joburi",
    ],
    userName: "Schipor Devis",
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
  return (
    <>
      <Bento stats={mockBentoData} />
      <div className="flex flex-col w-full items-center gap-5 my-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-secondary">
            Evenimente
          </h2>
          <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>

        <EventList maxItems={5} />

        <div className="mt-12 md:mt-16">
          <Link
            to="/evenimente"
            className="inline-block px-10 py-4 bg-white border border-gray-200 
                     rounded-2xl shadow-sm text-sm font-black text-primary 
                     transition-all duration-300 hover:bg-primary hover:text-white 
                     hover:shadow-lg active:scale-95"
          >
            Vezi mai multe evenimente
          </Link>
        </div>
      </div>
      <Carousel />
    </>
  );
}
