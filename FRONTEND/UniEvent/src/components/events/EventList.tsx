import EventCard from "./EventCard";
import { type Section } from "./eventMainType";

interface EventListProps {
  events: Section[][]; 
  isArchived: boolean;
  isGrid?: boolean;
  showCardButton?: boolean;
}

const EventList = ({ events, isArchived, isGrid = false, showCardButton = true }: EventListProps) => {
  return (
    <div className={isGrid 
      ? "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-7xl" 
      : "flex flex-col w-full max-w-7xl gap-8"}
    >
      {events.map((singleEvent, index) => (
        <EventCard 
          key={index} 
          data={singleEvent} 
          isArchived={isArchived} 
          showButton={showCardButton}
        />
      ))}

      {events.length === 0 && (
        <p className="text-center text-gray-400 py-10 col-span-full">
          Momentan nu sunt evenimente disponibile.
        </p>
      )}
    </div>
  );
};

export default EventList;