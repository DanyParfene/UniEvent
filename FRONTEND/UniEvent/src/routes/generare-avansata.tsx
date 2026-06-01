import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import FilterCard from "../components/filter/FilterCard";
import { useRef, useState } from "react";
import EventList from "../components/events/EventList";
import QueryBoundary from "../components/common/QueryBoundary";
import { usePartners } from "../api/partners";
import { useEventsQuery } from "../api/events";
import { useGenerateReport } from "../api/reports";
import { useScopedDepartmentParam } from "../api/helpers";
import { eventDtoToSections } from "../components/events/eventMainType";
import type { EventFilters } from "../api/events";

export const Route = createFileRoute("/generare-avansata")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function AdvancedReportContent() {
  const department = useScopedDepartmentParam();
  const { data: partnersList } = usePartners();
  const generateReport = useGenerateReport();

  const [filters, setFilters] = useState<EventFilters | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data: eventsPage, isLoading: eventsLoading } = useEventsQuery(
    filters
      ? {
          ...filters,
          ...(department ? { department } : {}),
        }
      : {},
    filters !== null,
  );

  const events = (eventsPage?.data ?? []).map((dto) => ({
    sections: eventDtoToSections(dto),
    id: dto.id,
  }));

  const selectedEventIds = events.map((e) => e.id).filter(Boolean) as string[];

  const handleSearch = (formFilters: {
    name: string;
    start_date: string;
    end_date: string;
    partners: string[];
    sort_by: "date" | "name";
    sort_direction: "asc" | "desc";
  }) => {
    setFilters({
      name: formFilters.name || undefined,
      start_date: formFilters.start_date || undefined,
      end_date: formFilters.end_date || undefined,
      partners: formFilters.partners.length ? formFilters.partners : undefined,
      sort_by: formFilters.sort_by,
      sort_direction: formFilters.sort_direction,
    });
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleGenerate = () => {
    generateReport.mutate({
      event_ids: selectedEventIds,
      filter_params: filters
        ? {
            name: filters.name,
            start_date: filters.start_date,
            end_date: filters.end_date,
            sort_by: filters.sort_by,
            sort_direction: filters.sort_direction,
            ...(department ? { department } : {}),
          }
        : undefined,
    });
  };

  return (
    <div className="w-full flex flex-col items-center bg-gray-50 py-12 px-4 min-h-screen">
      <FilterCard
        title="Generare avansată"
        partners={partnersList}
        onSearch={handleSearch}
      />

      {showResults && (
        <div
          ref={resultsRef}
          className="w-full max-w-7xl mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
          <div className="flex flex-row justify-between items-center mb-8 px-2">
            <div>
              <h1 className="text-3xl font-bold text-text-secondary tracking-tight">
                Rezultate
              </h1>
              <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generateReport.isPending || selectedEventIds.length === 0}
              className="px-6 py-2 bg-primary text-white font-bold rounded-xl transition-all hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generateReport.isPending ? "Se generează..." : "Generare"}
            </button>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              Nu există evenimente care să corespundă filtrelor selectate.
            </p>
          ) : (
            <EventList
              events={events}
              isArchived={false}
              isGrid={true}
              showCardButton={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

function RouteComponent() {
  return (
    <QueryBoundary>
      <AdvancedReportContent />
    </QueryBoundary>
  );
}
