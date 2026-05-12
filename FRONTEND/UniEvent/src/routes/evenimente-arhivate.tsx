import { createFileRoute } from "@tanstack/react-router";
import EventList from "../components/events/EventList";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/evenimente-arhivate")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full max-w-7xl px-4 py-10 md:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-4 md:gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text-secondary tracking-tight">
              Evenimente Arhivate
            </h1>
            <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
      <EventList isArchived = {true}/>
    </div>
  );
}
