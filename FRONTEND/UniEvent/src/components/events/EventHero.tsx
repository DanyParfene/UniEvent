import { eventData } from "./eventHeroType.ts";

const EventHero = () => {
  return (
    <div>
      {eventData.map((e) => (
        <div>
          <h2>{e.sectionTitle}</h2>
          <div>
            {e.fields.map((f) => (
              <div>
                <h3>{f.label}</h3>
                <p>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventHero;
