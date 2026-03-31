import { PartnerCard, type Partner } from "./PartnerCard";
import nokiaLogo from "../../assets/nokia_logo.png";
import continentalLogo from "../../assets/continental_logo.png";
import atosLogo from "../../assets/atos_logo.png";
import bcrLogo from "../../assets/bcr_logo.png";
import PartnerPopUp from "./PartnerPopUp";
import { useNavigate } from "@tanstack/react-router";
import RedirectButton from "../common/RedirectButton";

const partners: Partner[] = [
  { id: 0, name: "Nokia", logo: nokiaLogo },
  { id: 1, name: "Continental", logo: continentalLogo },
  { id: 2, name: "Atos", logo: atosLogo },
  { id: 3, name: "BCR", logo: bcrLogo },
];

type PartnersListProps = {
  isAdminMode?: boolean;
  isAddMode?: boolean;
  isEditMode?: boolean;
  editPartnerId?: number;
};

export const PartnersList = ({
  isAdminMode = false,
  isAddMode = false,
  isEditMode = false,
  editPartnerId,
}: PartnersListProps) => {
  const navigate = useNavigate();

  const partnerToEdit =
    isEditMode && editPartnerId !== undefined
      ? partners.find((p) => p.id === editPartnerId)
      : null;

  const handleDeleteClick = (partnerId: number) => {
    // TODO
    console.log("Delete partner clicked for ID:", partnerId);
  };

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-text-secondary mb-4 border-l-4 border-primary pl-4">
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
          <div key={item.id} className="w-full sm:w-[calc(50%-1rem)] md:w-64">
            {/* PartnerCard */}
            <PartnerCard
              {...item}
              isEditMode={isAdminMode}
              onDelete={() => handleDeleteClick(item.id)}
            />
          </div>
        ))}
      </div>

      {/* Admin controls area */}
      <div className="flex items-center">
        <RedirectButton
          to={ isAdminMode ? "/parteneri" : "/parteneri-administrare"}
          className="px-6 py-2 mx-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors shadow-sm cursor-pointer"
        >
          {isAdminMode ? "Ieși din Editare" : "Administrează"}
        </RedirectButton>

        {isAdminMode && (
          <RedirectButton
            to="/parteneri-adaugare"
            className="px-6 py-2 mx-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors shadow-sm cursor-pointer"
          >
            + Adauga Partener
          </RedirectButton>
        )}

        {(isAddMode || (isEditMode && editPartnerId !== undefined)) && (
          <PartnerPopUp
            name={partnerToEdit ? partnerToEdit.name : ""}
            logo={partnerToEdit ? partnerToEdit.logo : ""}
            onClose={() => navigate({ to: "/parteneri-administrare" })}
          />
        )}
      </div>
    </section>
  );
};
