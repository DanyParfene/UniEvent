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
    <div className="group max-w-7xl w-full mx-auto 
                    flex flex-col sm:flex-row justify-between items-start sm:items-center 
                    p-6 bg-white border border-gray-200 shadow-sm rounded-3xl 
                    transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50">
      
      <div className="flex flex-col w-full sm:w-auto">
        <div className="flex items-center gap-2 mb-1">
           <span className="w-2.5 h-2.5 rounded-full bg-[#2588e7] shrink-0"></span>
           <h1 className="text-base md:text-lg font-black text-[#033a89] leading-tight">
             {getEventField("Denumire eveniment")}
           </h1>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 ml-4 text-gray-400">
          <p className="text-sm font-medium">
            {getEventField("Dată eveniment")}
          </p>
          <p className="text-sm font-medium sm:border-l sm:border-gray-200 sm:pl-4">
            {getEventField("Oră eveniment")}
          </p>
        </div>
        
        <p className="mt-2 ml-4 text-sm font-semibold text-gray-500 group-hover:text-[#2588e7] transition-colors">
          {getEventField("Locație")}
        </p>
      </div>

      <button className="mt-6 sm:mt-0 sm:ml-6 w-full sm:w-auto px-8 py-3 
                        bg-white border border-gray-200 rounded-2xl shadow-sm 
                        text-sm font-black text-[#033a89] 
                        transition-all duration-300 
                        hover:bg-[#033a89] hover:text-white cursor-pointer 
                        active:scale-95 shrink-0">
        Detalii eveniment
      </button>
    </div>
  );
};

export default EventCard;
