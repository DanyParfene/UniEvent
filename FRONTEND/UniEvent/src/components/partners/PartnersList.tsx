import { PartnerCard, type Partner } from "./PartnerCard";
import nokiaLogo from "../../assets/nokia_logo.png";
import continentalLogo from "../../assets/continental_logo.png";
import atosLogo from "../../assets/atos_logo.png";
import bcrLogo from "../../assets/bcr_logo.png";
import PartnerPopUp from "./PartnerPopUp";
import { useState } from "react";

const partners: Partner[] = [
  { id: 0, name: "Nokia", logo: nokiaLogo },
  { id: 1, name: "Continental", logo: continentalLogo },
  { id: 2, name: "Atos", logo: atosLogo },
  { id: 3, name: "BCR", logo: bcrLogo },
];

export const PartnersList = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const handleEditClick = (partner: Partner) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  }

  const handleAddClick = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  }

  const handleDeleteClick = (partnerId: number) => {
    // TODO
    console.log("Delete partner clicked for ID:", partnerId);
  }

  const actionButtonStyle = "mt-6 sm:mt-0 sm:ml-6 w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-text-primary cursor-pointer active:scale-95 shrink-0";

  return (
    <section className="w-full max-w-7xl mx-auto py-10 px-4 md:px-12">
      <div className="mb-12">
        <div className="mb-6">
          <h1 className="text-3xl md:text-5xl font-bold text-text-secondary tracking-tight">
            Parteneriate
          </h1>
          <div className="mt-2 h-1 w-20 bg-primary rounded-full"></div>
        </div>
        
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

      <div className="flex flex-wrap justify-center gap-8 mb-12">
        {partners.map((item) => (
          <div key={item.id} className="w-full sm:w-[calc(50%-1rem)] md:w-64">
            <PartnerCard
              {...item}
              isEditMode={isAdminMode}
              onDelete={() => handleDeleteClick(item.id)}
              onEdit={() => handleEditClick(item)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={actionButtonStyle}
        >
          {isAdminMode ? "Ieși din Editare" : "Administrează"}
        </button>

        {isAdminMode && (
          <button
            onClick={handleAddClick}
            className={actionButtonStyle}
          >
            + Adaugă Partener
          </button>
        )}

        {isModalOpen && (
          <PartnerPopUp
            name={editingPartner ? editingPartner.name : ""}
            logo={editingPartner ? editingPartner.logo : ""}
            onClose={() => {
              setIsModalOpen(false);
              setEditingPartner(null);
            }}
          />
        )}
      </div>
    </section>
  );
};