import { useState } from "react";
import Accordion from "../common/Accordion";
import Input from "../common/Input";
import type { PartnerDto } from "../../api/api-types";

interface FilterValues {
  name: string;
  start_date: string;
  end_date: string;
  partners: string[];
  sort_by: "date" | "name";
  sort_direction: "asc" | "desc";
}

interface FilterCardProps {
  title: string;
  partners: PartnerDto[];
  onSearch: (filters: FilterValues) => void;
}

const FilterCard = ({ title, partners, onSearch }: FilterCardProps) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const togglePartner = (partnerName: string) => {
    setSelectedPartners((prev) =>
      prev.includes(partnerName)
        ? prev.filter((p) => p !== partnerName)
        : [...prev, partnerName],
    );
  };

  const handleSearch = () => {
    onSearch({
      name,
      start_date: startDate,
      end_date: endDate,
      partners: selectedPartners,
      sort_by: sortBy,
      sort_direction: sortDirection,
    });
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col min-h-[480px] h-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-text-secondary">{title}</h2>
        <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <Accordion title="General" initialOpenValue={true}>
          <div className="flex flex-col gap-4 w-[90%] max-w-md mx-auto">
            <Input
              label="Denumire"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Dată început"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="Dată sfârșit"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </Accordion>

        <Accordion title="Parteneri">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 w-[90%] max-w-md mx-auto px-2">
            {partners.map((item) => (
              <label
                key={item.id}
                className="flex flex-row gap-2 items-center cursor-pointer py-1"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 shrink-0 rounded border-gray-300 text-primary accent-primary"
                  checked={selectedPartners.includes(item.name)}
                  onChange={() => togglePartner(item.name)}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </label>
            ))}
            {partners.length === 0 && (
              <p className="text-sm text-gray-400 col-span-2">
                Nu există parteneri disponibili.
              </p>
            )}
          </div>
        </Accordion>

        <Accordion title="Ordonare">
          <div className="flex flex-col gap-4 w-[90%] max-w-md mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-gray-600">După</span>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "name")}
                >
                  <option value="date">Dată</option>
                  <option value="name">Denumire</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-gray-600">Direcție</span>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  value={sortDirection}
                  onChange={(e) =>
                    setSortDirection(e.target.value as "asc" | "desc")
                  }
                >
                  <option value="asc">Crescător</option>
                  <option value="desc">Descrescător</option>
                </select>
              </div>
            </div>
          </div>
        </Accordion>
      </div>

      <div className="mt-auto pt-8 flex justify-center w-full">
        <button
          onClick={handleSearch}
          className="mt-6 sm:mt-0 sm:ml-6 w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary transition-all duration-300 hover:bg-primary hover:text-text-primary cursor-pointer active:scale-95 shrink-0"
        >
          Căutare
        </button>
      </div>
    </div>
  );
};

export default FilterCard;
