import EventCard from "./EventCard";
import { type Section } from "./eventMainType";

interface EventListProps {
  events: Section[][]; 
  isArchived: boolean;
}

const EventList = ({ events, isArchived }: EventListProps) => {
  return (
    <div className="flex flex-col w-full max-w-7xl gap-8">
      {events.map((singleEvent, index) => (
        <EventCard key={index} data={singleEvent} isArchived={isArchived ? true : false}/>
      ))}

      {events.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          Momentan nu sunt evenimente disponibile.
        </p>
      )}
    </div>
  );
};

export default EventList;