import type React from "react";
import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
  isRequired?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

const NumberInput = ({ label, isRequired, ...props }: Props) => {
  const field = useFieldContext<number>();

  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      <label className="text-sm font-bold text-gray-700" htmlFor={field.name}>
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={field.name}
        type="text"
        value={field.state.value}
        onChange={(e) => {
          const value = Number(e.target.value);
          field.handleChange(!isNaN(value) ? value : 0);
        }}
        {...props}
        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:border-gray-400 bg-white"
      />
      <FieldErrors field={field} />
    </div>
  );
};

export default NumberInput;