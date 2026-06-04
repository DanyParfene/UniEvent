import { createFileRoute, useSearch } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import EventCardMain from "../components/events/EventCardMain";
import QueryBoundary from "../components/common/QueryBoundary";
import { useEvent } from "../api/events";
import { eventDtoToSections } from "../components/events/eventMainType";

type EventSearch = {
  id: string;
};

export const Route = createFileRoute("/eveniment")({
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): EventSearch => ({
    id: String(search?.id ?? ""),
  }),
  component: RouteComponent,
});

function EventContent() {
  const { id } = useSearch({ from: "/eveniment" });
  const { data: dto } = useEvent(id);
  const sections = eventDtoToSections(dto);

  return <EventCardMain key={dto.updatedAt} initialSections={sections} eventId={id} isArchived={false} />;
}

function RouteComponent() {
  return (
    <QueryBoundary>
      <EventContent />
    </QueryBoundary>
  );
}
