import Accordion from "../common/Accordion";
import Input from "../common/Input";
import RedirectButton from "../common/RedirectButton";
import type { Partner } from "../partners/PartnerCard";
import nokiaLogo from "../../assets/nokia_logo.png";
import continentalLogo from "../../assets/continental_logo.png";
import atosLogo from "../../assets/atos_logo.png";
import bcrLogo from "../../assets/bcr_logo.png";
import { Link } from "@tanstack/react-router";

const partners: Partner[] = [
  { id: 0, name: "Nokia", logo: nokiaLogo },
  { id: 1, name: "Continental", logo: continentalLogo },
  { id: 1, name: "Continental Haufe Group Romania", logo: continentalLogo },
  { id: 2, name: "Atos", logo: atosLogo },
  { id: 3, name: "BCR", logo: bcrLogo },
];

const FilterCard = () => {
  const actionButtonStyle = "w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-text-primary cursor-pointer active:scale-95 shrink-0";

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col min-h-[480px] h-auto">
      
      <h1 className="font-[Sans-Source-Now] text-2xl font-bold text-center w-full mb-6 text-gray-800">
        Filtrare căutare
      </h1>

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
                <input type="checkbox" className="w-4 h-4 shrink-0 rounded border-gray-300 text-primary" />
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
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary">
                  <option>Dată</option>
                  <option>Denumire</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-gray-600">Direcție</span>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary">
                  <option>Crescător</option>
                  <option>Descrescător</option>
                </select>
              </div>
            </div>
          </div>
        </Accordion>
      </div>

      <div className="mt-auto pt-8 flex justify-center w-full">
        <Link 
          to="/filtrare-evenimente" 
          title="Caută"
          className="mt-6 sm:mt-0 sm:ml-6 w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-text-primary cursor-pointer active:scale-95 shrink-0"
        >
          Căutare
        </Link>
      </div>
    </div>
  );
};

export default FilterCard;