import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import FilterCard from "../components/filter/FilterCard";
import QueryBoundary from "../components/common/QueryBoundary";
import { usePartners } from "../api/partners";

export const Route = createFileRoute("/filtrare-evenimente")({
  beforeLoad: () => requireAuth(),
  component: RouteComponent,
});

function FilterContent() {
  const { data: partners } = usePartners();
  const navigate = useNavigate();

  const handleSearch = (filters: {
    name: string;
    start_date: string;
    end_date: string;
    partners: string[];
    sort_by: "date" | "name";
    sort_direction: "asc" | "desc";
  }) => {
    navigate({
      to: "/evenimente",
      search: {
        page: 1,
        name: filters.name || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        partners: filters.partners.length ? filters.partners : undefined,
        sort_by: filters.sort_by,
        sort_direction: filters.sort_direction,
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4 min-h-[calc(100vh-5rem)]">
      <FilterCard title="Filtrare evenimente" partners={partners} onSearch={handleSearch} />
    </div>
  );
}

function RouteComponent() {
  return (
    <QueryBoundary>
      <FilterContent />
    </QueryBoundary>
  );
}
