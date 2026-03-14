import { Activity, useState } from "react";
import Accordion from "../common/Accordion";
import Input from "../common/Input";
import RedirectButton from "../common/RedirectButton";
import type { Partner } from "../../types/Partner";

import nokiaLogo from "../../assets/nokia_logo.png";
import continentalLogo from "../../assets/continental_logo.png";
import atosLogo from "../../assets/atos_logo.png";
import bcrLogo from "../../assets/bcr_logo.png";
import { PartnerCard } from "../partners/PartnerCard";

const partners: Partner[] = [
  { id: 0, name: "Nokia", logo: nokiaLogo },
  { id: 1, name: "Continental", logo: continentalLogo },
  { id: 2, name: "Atos", logo: atosLogo },
  { id: 3, name: "BCR", logo: bcrLogo },
];

const FilterCard = () => {
  const [isAdvancedFilter, setIsAdvancedFilter] = useState(false);
  return (
    <div className="flex flex-col justify-center items-center w-[60vw] px-16 py-10 gap-4 shadow-md rounded-2xl">
        <h1 className="text-2xl font-cold">
            Filtrare căutare
        </h1>
      
      <Accordion
        title="General"
        styles="!w-[clamp(200px,55vw,650px)]"
        initialOpenValue={true}
      >
        <Input label="Denumire" />
        <Input label="Data" type="date" />
      </Accordion>
      <Accordion title="Parteneri" styles="!w-[clamp(200px,55vw,650px)]">
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {partners.map((item) => (
            <div key={item.id} className="w-full sm:w-[calc(50%-1rem)] md:w-64">
              <PartnerCard
                partner={item}
                isEditMode={false}
                onEdit={undefined}
                onDelete={undefined}
              />
            </div>
          ))}
        </div>
      </Accordion>
      <label className="flex flex-row w-full items-center justify-end gap-1">
        <input
          type="checkbox"
          onClick={() => setIsAdvancedFilter((prev) => !prev)}
        />{" "}
        Filtrare avansata
      </label>
      <Activity mode={isAdvancedFilter ? "visible" : "hidden"}>
        <Accordion title="Detalii" styles="!w-[clamp(200px,55vw,650px)]">
          <Input label="abc" />
        </Accordion>

        <Accordion title="Ordonare" styles="!w-[clamp(200px,55vw,650px)]">
          abcd
        </Accordion>
      </Activity>
      <RedirectButton path="/" title="Caută" />
    </div>
  );
};

export default FilterCard;
