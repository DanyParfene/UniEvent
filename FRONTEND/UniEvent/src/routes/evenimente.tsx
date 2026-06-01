import {
  createFileRoute,
  useNavigate,
  useSearch,
  Link,
} from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import EventList from "../components/events/EventList";
import Pagination from "../components/events/Pagination";
import QueryBoundary from "../components/common/QueryBoundary";
import { useEvents } from "../api/events";
import { useScopedDepartmentParam } from "../api/helpers";
import { eventDtoToSections } from "../components/events/eventMainType";

type EventSearch = {
  page: number;
  name?: string;
  start_date?: string;
  end_date?: string;
  partners?: string[];
  sort_by?: "date" | "name";
  sort_direction?: "asc" | "desc";
};

export const Route = createFileRoute("/evenimente")({
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): EventSearch => {
    return {
      page: Number(search?.page) || 1,
      name: search?.name as string | undefined,
      start_date: search?.start_date as string | undefined,
      end_date: search?.end_date as string | undefined,
      partners: Array.isArray(search?.partners)
        ? (search.partners as string[])
        : search?.partners
          ? [String(search.partners)]
          : undefined,
      sort_by: (search?.sort_by as "date" | "name") || undefined,
      sort_direction: (search?.sort_direction as "asc" | "desc") || undefined,
    };
  },
  component: RouteComponent,
});

function EventenimenteContent() {
  const search = useSearch({ from: "/evenimente" });
  const navigate = useNavigate({ from: "/evenimente" });
  const department = useScopedDepartmentParam();

  const { data: eventsPage } = useEvents({
    page: search.page,
    name: search.name,
    start_date: search.start_date,
    end_date: search.end_date,
    partners: search.partners,
    sort_by: search.sort_by,
    sort_direction: search.sort_direction,
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-4 md:gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text-secondary tracking-tight">
              Evenimente
            </h1>
            <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
          </div>

          <Link
            to="/creare-eveniment"
            className="bg-text-primary w-9 h-9 md:w-12 md:h-12 rounded-full border font-semibold border-gray-200 text-primary text-2xl md:text-4xl flex justify-center items-center cursor-pointer hover:bg-primary hover:text-text-primary transition-all shadow-sm"
          >
            <span className="leading-none -translate-y-1">+</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/evenimente-arhivate"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-bold text-text-secondary hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Arhivă
          </Link>
          <Link
            to="/filtrare-evenimente"
            className="flex items-center gap-2 px-6 py-3 bg-primary rounded-2xl shadow-md text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95 cursor-pointer"
          >
            Filtrare
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
          <p className="text-lg font-bold text-gray-400">
            Nu exista evenimente disponibile!
          </p>
        </div>
      ) : (
        <>
          <EventList events={events} isArchived={false} />

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
      <EventenimenteContent />
    </QueryBoundary>
  );
}
