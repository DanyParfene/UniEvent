import { eventData } from "./eventMainType.ts";

const EventCardMain = () => {
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
          <hr />
        </div>
      ))}
    </div>
  );
};

export default EventCardMain;
