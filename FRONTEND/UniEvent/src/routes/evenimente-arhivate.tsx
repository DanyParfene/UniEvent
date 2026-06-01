import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import EventList from "../components/events/EventList";
import Pagination from "../components/events/Pagination";
import QueryBoundary from "../components/common/QueryBoundary";
import { useEvents } from "../api/events";
import { useScopedDepartmentParam } from "../api/helpers";
import { eventDtoToSections } from "../components/events/eventMainType";

type ArchivedSearch = {
  page: number;
};

export const Route = createFileRoute("/evenimente-arhivate")({
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): ArchivedSearch => ({
    page: Number(search?.page) || 1,
  }),
  component: RouteComponent,
});

function ArchivedEventsContent() {
  const search = useSearch({ from: "/evenimente-arhivate" });
  const navigate = useNavigate({ from: "/evenimente-arhivate" });
  const department = useScopedDepartmentParam();

  const { data: eventsPage } = useEvents({
    page: search.page,
    archived: true,
    ...(department ? { department } : {}),
  });

  const events = (eventsPage.data ?? []).map((dto) => ({
    sections: eventDtoToSections(dto),
    id: dto.id,
  }));

  const totalPages = eventsPage.meta?.last_page ?? 1;

  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  return (
    <div className="w-full max-w-7xl px-4 py-10 md:px-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-text-secondary tracking-tight">
          Arhivă Evenimente
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
          <p className="text-lg font-bold text-gray-400">
            Nu există evenimente arhivate!
          </p>
        </div>
      ) : (
        <>
          <EventList events={events} isArchived={true} />

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={search.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RouteComponent() {
  return (
    <QueryBoundary>
      <ArchivedEventsContent />
    </QueryBoundary>
  );
}
