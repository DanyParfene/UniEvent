// will be getting the name and logo as props from the PartersList

import type { Partner } from "../../types/Partner";
import editIcon from "../../assets/edit_icon.svg";
import deleteIcon from "../../assets/delete_icon.svg";

interface PartnerCardProps {
  partner: Partner;
  isEditMode: boolean;
  setIsPartnerFormActive: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: () => void;
  setDefaultName: React.Dispatch<React.SetStateAction<string>>;
  setDefaultLogo: React.Dispatch<React.SetStateAction<string>>;
}

export const PartnerCard = ({
  partner,
  isEditMode,
  setIsPartnerFormActive,
  onDelete,
  setDefaultName,
  setDefaultLogo,
}: PartnerCardProps) => {
  return (
    <div className="group relative flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:border-secondary hover:-translate-y-1">
      {/* edit/delete buttons when Edit Mode is active */}
      {isEditMode && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {/* Edit button */}
          <button
            onClick={() => {
              setIsPartnerFormActive(true);
              setDefaultName(partner.name);
              setDefaultLogo(partner.logo);
            }}
            className="group/btn p-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-secondary hover:border-white transition-all cursor-pointer"
            title="Edit"
          >
            <img
              src={editIcon}
              alt="Edit"
              className="w-4 h-4 group-hover/btn:brightness-0 group-hover/btn:invert"
            />
          </button>

          {/* Delete button */}
          <button
            onClick={onDelete}
            className="group/delete p-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-red-500 hover:border-white transition-all cursor-pointer"
            title="Delete"
          >
            <img
              src={deleteIcon}
              alt="Delete"
              className="w-4 h-4 group-hover/delete:brightness-0 group-hover/delete:invert"
            />
          </button>
        </div>
      )}

      <div className="h-16 w-full flex items-center justify-center mb-4">
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
          className="max-h-full max-w-35 object-contain filter opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
        />
      </div>

      <p className="text-sm font-semibold text-gray-500 transition-colors duration-300 group-hover:text-[primary]">
        {partner.name}
      </p>
    </div>
  );
};
