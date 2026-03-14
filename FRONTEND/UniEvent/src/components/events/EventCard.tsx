import { eventData } from "./eventMainType";

const getEventField = (label: string) => {
  for (const section of eventData) {
    const field = section.fields.find((f) => f.label === label);
    if (field) return field.value;
  }
  return "";
};

const EventCard = () => {
  return (
    <div className="group w-full md:w-[70%] lg:w-[60%] flex justify-between items-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-accent">
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-gray-700 transition-colors duration-300 group-hover:text-primary">
          {getEventField("Denumire eveniment")}
        </h1>

        <div className="flex gap-4 mt-2">
          <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
            {getEventField("Dată eveniment")}
          </p>

          <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
            {getEventField("Oră eveniment")}
          </p>
        </div>
        <p className="mt-2 text-sm font-semibold text-gray-500 transition-colors duration-300 group-hover:text-primary">
          {getEventField("Locație")}
        </p>
      </div>
      <button className="ml-6 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-secondary hover:border-white hover:text-white cursor-pointer">
        Detalii
      </button>
    </div>
  );
};

export default EventCard;
