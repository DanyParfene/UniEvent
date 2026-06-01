import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import Bento from "../components/charts/Bento";
import Carousel from "../components/carousel/Carousel";
import EventList from "../components/events/EventList";
import QueryBoundary from "../components/common/QueryBoundary";
import { useStatistics } from "../api/statistics";
import { useEvents } from "../api/events";
import { useScopedDepartmentParam } from "../api/helpers";
import { useAuth } from "../context/AuthContext";
import { eventDtoToSections } from "../components/events/eventMainType";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function DashboardContent() {
  const { user } = useAuth();
  const department = useScopedDepartmentParam();

  const { data: stats } = useStatistics(department);
  const { data: eventsPage } = useEvents({
    sort_by: "date",
    sort_direction: "asc",
    start_date: new Date().toLocaleDateString("en-CA"),
    page: 1,
    ...(department ? { department } : {}),
  });

  const upcomingEvents = Array.isArray(stats.next_5_events)
    ? stats.next_5_events.map((e) => ({ id: e.id, name: e.name }))
    : [];

  const bentoStats = {
    upcomingEvents: upcomingEvents,
    userName: user?.name ?? "",
    topOrganiser: stats.best_organizator ?? "—",
    topSponsorLogo: stats.best_partner?.logo_path ?? "",
    pressAppearances: stats.last_month_press_aparitions,
    maxParticipants: stats.most_participants,
    chartData: stats.number_of_events_per_month.map((item) => ({
      name: item.month,
      value: item.count,
    })),
  };

  const dashboardEvents = (eventsPage.data ?? []).slice(0, 5).map((dto) => ({
    sections: eventDtoToSections(dto),
    id: dto.id,
  }));

  return (
    <>
      <Bento stats={bentoStats} />
      <div className="flex flex-col w-full items-center gap-5 my-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-secondary">
            Evenimente
          </h2>
          <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>

        {dashboardEvents.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-lg font-bold text-gray-400">
              Nu exista evenimente disponibile!
            </p>
          </div>
        ) : (
          <>
            <EventList events={dashboardEvents} isArchived={false} />
            <div className="mt-12 md:mt-16">
              <Link
                to="/evenimente"
                search={{ page: 1 }}
                className="inline-block px-10 py-4 bg-white border border-gray-200 
                         rounded-2xl shadow-sm text-sm font-black text-primary 
                         transition-all duration-300 hover:bg-primary hover:text-white 
                         hover:shadow-lg active:scale-95"
              >
                Vezi mai multe evenimente
              </Link>
            </div>
          </>
        )}
      </div>
      <QueryBoundary>
        <Carousel />
      </QueryBoundary>
    </>
  );
}

function RouteComponent() {
  return (
    <QueryBoundary>
      <DashboardContent />
    </QueryBoundary>
  );
}
