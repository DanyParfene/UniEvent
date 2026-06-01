import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";
import { usePartners } from "../../../api/partners";
import { useFaculty } from "../../../context/FacultyContext";
import { Suspense } from "react";

function PartnerCheckboxList({ selectedIds, onChange, onBlur }: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onBlur: () => void;
}) {
  const { state } = useFaculty();
  const { data: partners } = usePartners(state.currentFaculty);

  const handleCheckboxChange = (partnerId: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedIds, partnerId]);
    } else {
      onChange(selectedIds.filter((id) => id !== partnerId));
    }
  };

  if (partners.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-2">
        Nu există parteneri disponibili pentru acest departament.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {partners.map((partner) => (
        <label
          key={partner.id}
          className="flex items-center gap-3 cursor-pointer group text-sm"
        >
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
            checked={selectedIds.includes(partner.id)}
            onChange={(e) => handleCheckboxChange(partner.id, e.target.checked)}
            onBlur={onBlur}
          />
          <span className="text-sm text-slate-800 group-hover:text-primary transition-colors">
            {partner.name}
          </span>
        </label>
      ))}
    </div>
  );
}

export default function MultiCheckboxInput({ label }: { label: string }) {
  const field = useFieldContext<string[]>();
  const selectedIds: string[] = field.state.value || [];

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-bold text-gray-700">{label}</label>

      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-60 overflow-y-auto">
        <Suspense
          fallback={
            <p className="text-sm font-bold text-gray-700">
              Se încarcă partenerii...
            </p>
          }
        >
          <PartnerCheckboxList
            selectedIds={selectedIds}
            onChange={(ids) => field.handleChange(ids)}
            onBlur={field.handleBlur}
          />
        </Suspense>
      </div>

      <FieldErrors field={field as any} />
    </div>
  );
}
