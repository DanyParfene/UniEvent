import { PartnerCard } from "./PartnerCard";
import { type Partner } from "../../types/Partner";
import nokiaLogo from "../../assets/nokia_logo.png";
import continentalLogo from "../../assets/continental_logo.png";
import atosLogo from "../../assets/atos_logo.png";
import bcrLogo from "../../assets/bcr_logo.png";
import { useState } from "react";
import PartnerPopUp from "./PartnerPopUp";

const partners: Partner[] = [
  { id: 0, name: "Nokia", logo: nokiaLogo },
  { id: 1, name: "Continental", logo: continentalLogo },
  { id: 2, name: "Atos", logo: atosLogo },
  { id: 3, name: "BCR", logo: bcrLogo },
];

export const PartnersList = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isPartnerFormActive, setIsPartnerFormActive] = useState<boolean>(false);
  const [defaultName, setDefaultName] = useState<string>("");
  const [defaultLogo, setDefaultLogo] = useState<string>("");

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-[#121212] mb-4 border-l-4 border-[#033A89] pl-4">
          Parteneriate
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-5xl">
          Proiectele educaţionale, de cercetare ştiinţifică, culturale,
          artistice şi sportive implementate de către UVT au primit un sprijin
          real, activ din partea partenerilor, entităţi reprezentative din
          mediul socio-economic, cultural, artistic şi sportiv de la nivel
          regional, naţional şi internaţional. În ultimii ani, proiectele de
          impact ale UVT pe plan local, regional și național au fost susţinute
          de parteneri din mediul socio-economic:
        </p>
      </div>
      {/* Containerul FLEX */}
      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {partners.map((item) => (
          // W-full pe mobil, w-[calc(50%-1rem)] pe tableta, w-64 pe desktop
          <div key={item.id} className="w-full sm:w-[calc(50%-1rem)] md:w-64">
            <PartnerCard
              partner={item}
              isEditMode={isEditMode}
              setDefaultName={setDefaultName}
              setDefaultLogo={setDefaultLogo}
              setIsPartnerFormActive={setIsPartnerFormActive}
              onDelete={undefined}
            />
          </div>
        ))}
      </div>

      {/* Admin controls area */}
      <div>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="px-6 py-2 mx-2 bg-[#033A89] text-white rounded-lg font-medium hover:bg-[#2588E7] transition-colors shadow-sm cursor-pointer"
        >
          {isEditMode ? "Ieși din Editare" : "Administrează"}
        </button>

        {isEditMode && (
          <button
            onClick={() => {
              setIsPartnerFormActive(true);
              setDefaultName("");
              setDefaultLogo("");
            }}
            className="px-6 py-2 mx-2 bg-[#033A89] text-white rounded-lg font-medium hover:bg-[#2588E7] transition-colors shadow-sm cursor-pointer"
          >
            + Adaugă Partener Nou
          </button>
        )}
        {isPartnerFormActive && (
          <PartnerPopUp
            name={defaultName}
            logo={defaultLogo}
            setIsPartnerFormActive={setIsPartnerFormActive}
          />
        )}
      </div>
    </section>
  );
};
