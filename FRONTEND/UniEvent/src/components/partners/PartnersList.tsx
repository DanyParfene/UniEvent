import { PartnerCard } from "./PartnerCard";
import PartnerPopUp from "./PartnerPopUp";
import { useState } from "react";
import { usePartners, useDeletePartner } from "../../api/partners";
import type { PartnerDto } from "../../api/api-types";
import { useFaculty } from "../../context/FacultyContext";

export const PartnersList = () => {
  const { state: facultyState } = useFaculty();
  const { data: partners } = usePartners(facultyState.currentFaculty);
  const deletePartner = useDeletePartner();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerDto | null>(null);

  const handleEditClick = (partner: PartnerDto) => {
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (partnerId: string) => {
    deletePartner.mutate(partnerId);
  };

  const actionButtonStyle =
    "mt-6 sm:mt-0 sm:ml-6 w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-text-primary cursor-pointer active:scale-95 shrink-0";

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
              id={item.id}
              name={item.name}
              logo={item.logo_path}
              isEditMode={isAdminMode}
              onDelete={() => handleDeleteClick(item.id)}
              onEdit={() => handleEditClick(item)}
            />
          </div>
        ))}
        {partners.length === 0 && (
          <p className="text-gray-400 py-10">Nu există parteneri înregistrați.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setIsAdminMode(!isAdminMode)}
          className={actionButtonStyle}
        >
          {isAdminMode ? "Ieși din Editare" : "Administrează"}
        </button>

        {isAdminMode && (
          <button onClick={handleAddClick} className={actionButtonStyle}>
            + Adaugă Partener
          </button>
        )}

        {isModalOpen && (
          <PartnerPopUp
            partnerId={editingPartner?.id}
            name={editingPartner?.name ?? ""}
            logo={editingPartner?.logo_path ?? null}
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
