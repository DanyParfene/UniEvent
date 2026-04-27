import Accordion from "../common/Accordion";
import Input from "../common/Input";
import RedirectButton from "../common/RedirectButton";
import type { Partner } from "../partners/PartnerCard";
import nokiaLogo from "../../assets/nokia_logo.png";
import continentalLogo from "../../assets/continental_logo.png";
import atosLogo from "../../assets/atos_logo.png";
import bcrLogo from "../../assets/bcr_logo.png";

const partners: Partner[] = [
  { id: 0, name: "Nokia", logo: nokiaLogo },
  { id: 1, name: "Continental", logo: continentalLogo },
  { id: 1, name: "Continental Haufe Group Romania", logo: continentalLogo },
  { id: 2, name: "Atos", logo: atosLogo },
  { id: 3, name: "BCR", logo: bcrLogo },
];

const FilterCard = () => {
  return (
    /* - min-h-[480px]: Păstrează dimensiunea mare "standard".
       - h-auto: Îi permite să crească vertical când deschizi acordioanele.
    */
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col min-h-[480px] h-auto">
      
      <h1 className="text-xl font-bold text-center w-full mb-6 text-gray-800">
        Filtrare căutare
      </h1>

      {/* Containerul pentru acordioane (fără overflow-y-auto aici, folosim scroll-ul paginii) */}
      <div className="flex flex-col gap-4 w-full">
        <Accordion title="General" initialOpenValue={true}>
          <div className="flex flex-col gap-4 w-[90%] max-w-md mx-auto">
            <Input label="Denumire" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Input label="Dată început" type="date" />
               <Input label="Dată sfârșit" type="date" />
            </div>
          </div>
        </Accordion>

        <Accordion title="Parteneri">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 w-[90%] max-w-md mx-auto px-2">
            {partners.map((item, index) => (
              <label key={`${item.id}-${index}`} className="flex flex-row gap-2 items-center cursor-pointer py-1">
                <input type="checkbox" className="w-4 h-4 shrink-0 rounded border-gray-300 text-[#033a89]" />
                <span className="text-sm text-gray-700">{item.name}</span>
              </label>
            ))}
          </div>
        </Accordion>

        <Accordion title="Ordonare">
          <div className="flex flex-col gap-4 w-[90%] max-w-md mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-gray-600">După</span>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#033a89]">
                  <option>Dată</option>
                  <option>Denumire</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-gray-600">Direcție</span>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#033a89]">
                  <option>Crescător</option>
                  <option>Descrescător</option>
                </select>
              </div>
            </div>
          </div>
        </Accordion>
      </div>

      {/* Butonul de jos: Folosim mt-auto pentru a-l ține la baza cardului de 480px, 
          dar va coborî natural dacă cardul se lungește. */}
      <div className="mt-auto pt-8 flex justify-center w-full">
        <RedirectButton 
          to="/filtrare-evenimente" 
          title="Caută"
          className="w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-[#033a89] hover:bg-[#033a89] hover:text-white transition-all cursor-pointer active:scale-95"
        >
          Căutare
        </RedirectButton>
      </div>
    </div>
  );
};

export default FilterCard;