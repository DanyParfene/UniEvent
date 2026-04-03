import EventCard from "./EventCard";
import { eventData } from "./eventMainType";

const EventList = () => {
    const allEvents = [eventData, eventData, eventData, eventData, eventData];

    return(
        <div className="flex flex-col w-full items-center gap-5 my-10">
            {allEvents.map((singleEvent, index) => (
                <EventCard key={index} data={singleEvent}/>
            ))}
        </div>
    );
}

export default EventList;