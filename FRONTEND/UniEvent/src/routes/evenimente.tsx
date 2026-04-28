import { createFileRoute } from "@tanstack/react-router";
import EventList from "../components/events/EventList";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/evenimente")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full max-w-7xl px-4 py-10 md:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-4 md:gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text-secondary tracking-tight">
              Evenimente
            </h1>
            <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
          </div>

          <Link
            to="/create-event"
            className="bg-text-primary w-9 h-9 md:w-12 md:h-12 rounded-full border font-semibold border-gray-200 text-primary text-2xl md:text-4xl flex justify-center items-center cursor-pointer hover:bg-primary hover:text-text-primary transition-all shadow-sm"
          >
            <span className="leading-none -translate-y-1">+</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/filtrare-evenimente"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-bold text-text-secondary hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Filtrare
          </Link>

          <button className="flex items-center gap-2 px-6 py-3 bg-primary rounded-2xl shadow-md text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95 cursor-pointer">
            Generare
          </button>
        </div>
      </div>

      <EventList />
    </div>
  );
}
