import Link from "../common/Link";
import ActionButton from "../common/ActionButton";

type SocialMediaCardTypes = {
  link: string;
  reach: number;
  engagement: number;
  forcedEditMode?: boolean;
  showDelete?: boolean;
  showErrors?: boolean;
  onDelete?: () => void;
  onChange?: (data: any) => void;
};

const SocialMediaCard = ({
  link,
  reach,
  engagement,
  showDelete = false,
  showErrors = false,
  forcedEditMode = false,
  onDelete,
  onChange,
}: SocialMediaCardTypes) => {
  const handleInputChange = (field: string, value: string | number) => {
    const numericValue = value === "" ? 0 : Number(value);

    if (onChange) {
      onChange({
        link: field === "link" ? value : link,
        reach: field === "reach" ? numericValue : reach,
        engagement: field === "engagement" ? numericValue : engagement,
      });
    }
  };

  return forcedEditMode ? (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col md:flex-row md:items-end gap-6">
        <label className="flex-1 flex flex-col gap-1.5">
          <span className="font-semibold text-sm ml-1">Link</span>
          <input
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-opacity-50 focus:ring-secondary shadow-gray-300"
            value={link}
            onChange={(e) => handleInputChange("link", e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="flex-1 md:max-w-[150px] flex flex-col gap-1.5">
          <span className="font-semibold text-sm ml-1">Reach</span>
          <input
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-opacity-50 focus:ring-secondary shadow-gray-300"
            value={reach === 0 && link === "" ? "" : reach}
            onChange={(e) =>
              handleInputChange("reach", e.target.value)
            }
          />
        </label>

        <label className="flex-1 md:max-w-[150px] flex flex-col gap-1.5">
          <span className="font-semibold text-sm ml-1">Engagement</span>
          <input
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm shadow-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-opacity-50 focus:ring-secondary shadow-gray-300"
            value={engagement === 0 && link === "" ? "" : engagement}
            onChange={(e) =>
              handleInputChange("engagement", e.target.value)
            }
          />
        </label>

        {showDelete && onDelete && (
          <ActionButton
            className="flex-1 md:flex-none px-8 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-white cursor-pointer active:scale-95 whitespace-nowrap"
            action={onDelete}
          >
            Șterge
          </ActionButton>
        )}
      </div>
      {showErrors && (
        <p className="text-red-500 text-small font-bold ml-4 flex items-center animate-in fade-in slide-in-from-top-1">
          Câmpul link este obligatoriu pentru a putea salva!
        </p>
      )}
    </div>
  ) : (
    <div className="rounded-lg shadow-sm px-4 py-2 flex flex-col justify-between items-center hover:shadow-md transition-all duration-300 w-full md:flex-row lg:flex-row">
      <Link link={link} />
      <label className="flex flex-row md:flex-col lg:flex-col gap-2">
        <span className="font-semibold">Reach</span>
        {reach}
      </label>
      <label className="flex flex-row md:flex-col lg:flex-col gap-2">
        <span className="font-semibold">Engagement</span>
        {engagement}
      </label>
    </div>
  );
};

export default SocialMediaCard;
