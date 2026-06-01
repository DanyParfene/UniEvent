import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import ReportCard from "../components/reports/ReportCard";
import ReportSection from "../components/reports/ReportSection";
import QueryBoundary from "../components/common/QueryBoundary";
import { usePartners } from "../api/partners";
import { useEventsQuery } from "../api/events";
import { useGenerateReport } from "../api/reports";
import { useScopedDepartmentParam } from "../api/helpers";

export const Route = createFileRoute("/rapoarte")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function ReportsContent() {
  const department = useScopedDepartmentParam();
  const { data: partnersList } = usePartners();
  const { data: eventsPage, isLoading: eventsLoading } = useEventsQuery(
    { department, sort_by: "name", sort_direction: "asc" },
    true,
  );
  const generateReport = useGenerateReport();

  const events = eventsPage?.data ?? [];

  const timeRanges = [
    { label: "1 an", months: 12 },
    { label: "6 luni", months: 6 },
    { label: "3 luni", months: 3 },
  ];

  const getDateRange = (months: number) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    return {
      start_date: start.toLocaleDateString("en-CA"),
      end_date: end.toLocaleDateString("en-CA"),
    };
  };

  const handleTimeRangeReport = (months: number) => {
    const { start_date, end_date } = getDateRange(months);
    generateReport.mutate({
      filter_params: { start_date, end_date, ...(department ? { department } : {}) },
    });
  };

  const handlePartnerReport = (partnerId: string) => {
    generateReport.mutate({ partner_ids: [partnerId] });
  };

  const handleEventReport = (eventId: string) => {
    generateReport.mutate({ event_ids: [eventId] });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 md:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-text-secondary tracking-tight">
            Rapoarte
          </h1>
          <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
        </div>

        <Link
          to="/generare-avansata"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-primary rounded-2xl shadow-md text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95 cursor-pointer"
        >
          Generare Avansată
        </Link>
      </div>

      <div className="flex flex-col gap-12">
        <ReportSection title="Interval de Timp">
          {timeRanges.map(({ label, months }) => (
            <ReportCard
              key={label}
              id={label}
              title={`Raport ${label}`}
              onGenerate={() => handleTimeRangeReport(months)}
              isLoading={generateReport.isPending}
            />
          ))}
        </ReportSection>

        <ReportSection title="Sponsori">
          {partnersList.map((partner) => (
            <ReportCard
              key={partner.id}
              id={partner.id}
              title={partner.name}
              imageUrl={partner.logo_path ?? undefined}
              onGenerate={() => handlePartnerReport(partner.id)}
              isLoading={generateReport.isPending}
            />
          ))}
          {partnersList.length === 0 && (
            <p className="text-gray-400">Nu există parteneri disponibili.</p>
          )}
        </ReportSection>

        <ReportSection title="Evenimente Specifice">
          {events.map((event) => (
            <ReportCard
              key={event.id}
              id={event.id}
              title={event.eventName}
              onGenerate={() => handleEventReport(event.id)}
              isLoading={generateReport.isPending}
            />
          ))}
          {!eventsLoading && events.length === 0 && (
            <p className="text-gray-400">Nu există evenimente disponibile.</p>
          )}
        </ReportSection>
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <QueryBoundary>
      <ReportsContent />
    </QueryBoundary>
  );
}
