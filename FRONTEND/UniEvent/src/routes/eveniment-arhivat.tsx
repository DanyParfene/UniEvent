import { createFileRoute, useSearch } from "@tanstack/react-router";
import { requireAuth } from "../lib/require-auth";
import EventCardMain from "../components/events/EventCardMain";
import QueryBoundary from "../components/common/QueryBoundary";
import { useEvent } from "../api/events";
import { eventDtoToSections } from "../components/events/eventMainType";

type EventSearch = {
  id: string;
};

export const Route = createFileRoute("/eveniment-arhivat")({
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): EventSearch => ({
    id: String(search?.id ?? ""),
  }),
  component: RouteComponent,
});

function EventArchivedContent() {
  const { id } = useSearch({ from: "/eveniment-arhivat" });
  const { data: dto } = useEvent(id);
  const sections = eventDtoToSections(dto);

  return <EventCardMain initialSections={sections} eventId={id} isArchived={true} />;
}

function RouteComponent() {
  return (
    <QueryBoundary>
      <EventArchivedContent />
    </QueryBoundary>
  );
}
