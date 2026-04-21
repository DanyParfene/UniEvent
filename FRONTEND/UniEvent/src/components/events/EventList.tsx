import EventCard from "./EventCard";
import { eventData } from "./eventMainType";

interface EventListProps {
    maxItems?: number;
}

const EventList = ({ maxItems } : EventListProps) => {
  const allEvents = [eventData, eventData, eventData, eventData, eventData, eventData, eventData];

  const displayedEvents = maxItems ? allEvents.slice(0, maxItems) : allEvents;

  return (
    <div className="flex flex-col w-full max-w-7xl gap-8">
      {displayedEvents.map((singleEvent, index) => (
        <EventCard key={index} data={singleEvent} />
      ))}

      {allEvents.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          Momentan nu sunt evenimente disponibile.
        </p>
      )}

    </div>
  );
};

export default EventList;
