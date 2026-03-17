import editIcon from "../../assets/edit_icon.svg";
import deleteIcon from "../../assets/delete_icon.svg";

export type Partner = {
  id: number;
  name: string;
  logo: string;
};

type OptionalType = {
  isEditMode: boolean;
  onEdit: (partner: Partner) => void;
  onDelete: () => void;
  className: string;
  disableHover: boolean;
};

type PartnerCardProps = Partner & Partial<OptionalType>;

export const PartnerCard = ({
  id,
  name,
  logo,
  isEditMode = false,
  onEdit,
  onDelete,
  className,
  disableHover
}: PartnerCardProps) => {

  const baseCardClasses = "relative flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl transition-all duration-300";
  const hoverCardClasses = disableHover ? "" : "group hover:shadow-xl hover:shadow-blue-500/5 hover:border-secondary hover:-translate-y-1";

  const baseImageClasses = "max-h-full max-w-35 object-contain filter opacity-80 transition-all duration-300";
  const hoverImageClasses = disableHover ? "" : "group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110";

  const baseTextClasses = "text-sm font-semibold text-gray-500 transition-colors duration-300";
  const hoverTextClasses = disableHover ? "" : "group-hover:text-primary";

  return (
    <div className={`${baseCardClasses} ${hoverCardClasses} ${className}`}>
      {/* Edit/delete buttons when Edit Mode is active */}
      {isEditMode && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {/* Edit button */}
          {onEdit && (
            <button
              onClick={() => onEdit({id, name, logo})}
              className="group/btn p-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-secondary hover:border-white transition-all cursor-pointer"
              title="Edit"
            >
              <img
                src={editIcon}
                alt="Edit"
                className="w-4 h-4 group-hover/btn:brightness-0 group-hover/btn:invert"
              />
            </button>
          )}

          {/* Delete button */}
          {onDelete && (
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
          )}
        </div>
      )}

      <div className="h-16 w-full flex items-center justify-center mb-4">
        <img
          src={logo}
          alt={`${name} logo`}
          className={`${baseImageClasses} ${hoverImageClasses}`}
        />
      </div>

      <p className={`${baseTextClasses} ${hoverTextClasses}`}>
        {name}
      </p>
    </div>
  );
};
