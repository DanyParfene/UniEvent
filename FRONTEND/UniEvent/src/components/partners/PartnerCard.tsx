import editIcon from "../../assets/edit_icon.svg";
import deleteIcon from "../../assets/delete_icon.svg";
import ActionButton from "../common/ActionButton";
import { getGoogleDriveDirectLink } from "../common/DriveImage";

export type Partner = {
  id: string | number;
  name: string;
  logo: string | null;
};

type OptionalType = {
  isEditMode: boolean;
  onDelete: () => void;
  onEdit: () => void;
  className: string;
  disableHover: boolean;
};

type PartnerCardProps = Partner & Partial<OptionalType>;

export const PartnerCard = ({
  name,
  logo,
  isEditMode = false,
  onDelete,
  onEdit,
  className = "",
  disableHover,
}: PartnerCardProps) => {
  const baseCardClasses =
    "relative flex flex-col items-center justify-center p-6 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300";

  const hoverCardClasses = disableHover
    ? ""
    : "group hover:shadow-xl hover:shadow-secondary/10 ";

  const baseImageClasses =
    "max-h-full max-w-35 object-contain filter transition-all duration-300";

  const baseTextClasses =
    "text-sm font-semibold text-gray-500 transition-colors duration-300";
  const hoverTextClasses = disableHover ? "" : "group-hover:text-primary";

  return (
    <div className={`${baseCardClasses} ${hoverCardClasses} ${className}`}>
      {isEditMode && (
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {onEdit && (
            <ActionButton
              action={onEdit}
              className="group/btn p-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-secondary hover:border-transparent transition-all"
              title="Edit"
            >
              <img
                src={editIcon}
                alt="Edit"
                className="w-4 h-4 group-hover/btn:brightness-0 group-hover/btn:invert"
              />
            </ActionButton>
          )}

          {onDelete && (
            <ActionButton
              action={onDelete}
              className="group/delete p-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-red-500 hover:border-transparent"
              title="Delete"
            >
              <img
                src={deleteIcon}
                alt="Delete"
                className="w-4 h-4 transition-all group-hover/delete:brightness-0 group-hover/delete:invert"
              />
            </ActionButton>
          )}
        </div>
      )}

      <div className="h-16 w-full flex items-center justify-center mb-4">
        {logo ? (
          <img src={getGoogleDriveDirectLink(logo)} alt={`${name} logo`} className={baseImageClasses} />
        ) : (
          <span className="text-2xl font-black text-primary">
            {name.charAt(0)}
          </span>
        )}
      </div>

      <p className={`${baseTextClasses} ${hoverTextClasses}`}>{name}</p>
    </div>
  );
};
