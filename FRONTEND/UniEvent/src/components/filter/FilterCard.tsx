import Accordion from "../common/Accordion";
import Input from "../common/Input";
import RedirectButton from "../common/RedirectButton";
import type { Partner } from "../../types/Partner";

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
    <div className="flex flex-col justify-center items-center w-[60vw] px-16 py-10 gap-4 shadow-md rounded-2xl m-auto">
      <h1 className="text-2xl font-cold">Filtrare căutare</h1>

      <Accordion
        title="General"
        styles="!w-[clamp(200px,55vw,650px)]"
        initialOpenValue={true}
      >
        <Input label="Denumire" />
        <Input label="Dată început" type="date" />
        <Input label="Dată sfârșit" type="date" />{" "}
        {/* e automat data inceput; nu poate fi mai mica decat data de inceput*/}
      </Accordion>
      <Accordion title="Parteneri" styles="!w-[clamp(200px,55vw,650px)]">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 px-6">
          {partners.map((item) => (
            <label className="flex flex-row  gap-2 items-center">
              <input type="checkbox" className="w-5 h-5 shrink-0" />
              {item.name}
            </label>
          ))}
        </div>
      </Accordion>
      <Accordion title="Ordonare" styles="!w-[clamp(200px,55vw,650px)]">
        <label className="flex flex-col gap-1 w-[clamp(150px,50vw,600px)]">
          <span className="font-bold">
          După
          </span>
          <select className="appearance-none rounded-md px-4 py-2 shadow-sm focus:outline-none focus:shadow-md hover:shadow-md focus:shadow-accent transition-all duration-300">
            <option className="focus:bg-gray-100">Dată</option>
            <option>Denumire</option>
            <option>Dată</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 w-[clamp(150px,50vw,600px)]">
          <span className="font-bold">
          Direcție
          </span>
          <select className="appearance-none rounded-md px-4 py-2 shadow-sm focus:outline-none focus:shadow-md hover:shadow-md focus:shadow-accent transition-all duration-300">
            <option>Crescător</option>
            <option>Descrescător</option>
          </select>
        </label>
      </Accordion>
      <RedirectButton path="/" title="Caută" />
    </div>
  );
};

export default FilterCard;
