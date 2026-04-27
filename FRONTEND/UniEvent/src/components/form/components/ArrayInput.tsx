import type React from "react";
import { useFieldContext } from "../context";
import { useRef } from "react";
import FieldErrors from "./FieldErrors";
import Chip from "../../filter/Chip";

type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const ArrayInput = ({ label, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useFieldContext<string[]>();

  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      
      <label className="text-sm font-bold text-gray-700" htmlFor={field.name}>
        {label}
      </label>
      
      <div className="flex flex-col gap-4">
        <input
          id={field.name}
          type="text"
          ref={inputRef}
          {...props}
          className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:border-[#033a89] focus:outline-none focus:ring-1 focus:ring-[#033a89] hover:border-gray-400 bg-white"
        />
        
        <button
          type="button"
          onClick={() => {
            if (inputRef.current == null || inputRef.current.value === "") {
              return;
            }
            const value = inputRef.current.value;
            if (field.state.value.some((val) => val === value)) {
              return;
            }
            field.handleChange((prev) => [...prev, value]);
            inputRef.current.value = "";
          }}
          className="w-full sm:w-auto px-8 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-[#033a89] transition-all duration-300 hover:bg-[#033a89] hover:text-white cursor-pointer active:scale-95"
        >
          Adaugă
        </button>

        <div className="flex gap-3 flex-wrap mt-2">
          {field.state.value.map((el) => (
            <Chip
              key={el}
              value={el}
              onClose={() =>
                field.handleChange((prev) => prev.filter((val) => val !== el))
              }
            />
          ))}
        </div>
      </div>
      <FieldErrors field={field} />
    </div>
  );
};

export default ArrayInput;