import { useState, useEffect } from "react";
import { useFieldContext } from "../context"; 
import FieldErrors from "./FieldErrors";

const MOCK_PARTNERS = [
  { id: "p1", name: "Primăria Municipiului Timișoara" },
  { id: "p2", name: "Consiliul Județean Timiș" },
  { id: "p3", name: "OSUT" },
  { id: "p4", name: "Nokia Romania" },
  { id: "p5", name: "Continental Automotive" },
];

export default function MultiCheckboxInput({ label }: { label: string }) {
  const field = useFieldContext<string[]>(); 
  
  const [partners, setPartners] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedIds: string[] = field.state.value || [];

  useEffect(() => {
    const fetchPartners = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPartners(MOCK_PARTNERS);
      setIsLoading(false);
    };
    fetchPartners();
  }, []);

  const handleCheckboxChange = (partnerId: string, checked: boolean) => {
    if (checked) {
      field.handleChange([...selectedIds, partnerId]);
    } else {
      field.handleChange(selectedIds.filter((id) => id !== partnerId));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-60 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm font-bold text-gray-700">Se încarcă partenerii...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {partners.map((partner) => (
              <label key={partner.id} className="flex items-center gap-3 cursor-pointer group text-sm">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                  checked={selectedIds.includes(partner.id)}
                  onChange={(e) => handleCheckboxChange(partner.id, e.target.checked)}
                  onBlur={field.handleBlur}
                />
                <span className="text-sm text-slate-800 group-hover:text-primary transition-colors">
                  {partner.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
            
        <FieldErrors field={field as any} />
      
    </div>
  );
}