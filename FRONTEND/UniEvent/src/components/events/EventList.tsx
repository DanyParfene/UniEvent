import EventCard from "./EventCard";
import { type Section } from "./eventMainType";

interface EventListItem {
  sections: Section[];
  id?: string;
}

interface EventListProps {
  events: Section[][] | EventListItem[];
  isArchived: boolean;
  isGrid?: boolean;
  showCardButton?: boolean;
}

function isEventListItem(item: Section[] | EventListItem): item is EventListItem {
  return !Array.isArray(item) && 'sections' in item;
}

const EventList = ({ events, isArchived, isGrid = false, showCardButton = true }: EventListProps) => {
  return (
    <div className={isGrid
      ? "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl"
      : "flex flex-col w-full max-w-7xl gap-8"}
    >
      {events.map((item, index) => {
        const sections = isEventListItem(item) ? item.sections : item;
        const id = isEventListItem(item) ? item.id : undefined;
        return (
          <EventCard
            key={id ?? index}
            data={sections}
            isArchived={isArchived}
            showButton={showCardButton}
            eventId={id}
          />
        );
      })}

      {events.length === 0 && (
        <p className="text-center text-gray-400 py-10 col-span-full">
          Momentan nu sunt evenimente disponibile.
        </p>
      )}
    </div>
  );
};

export default EventList;
