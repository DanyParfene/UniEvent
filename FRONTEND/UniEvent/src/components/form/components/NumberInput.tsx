import type React from "react";
import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const NumberInput = ({ label, ...props }: Props) => {
  const field = useFieldContext<number>();

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="font-[Sans-Source-Now] text-lg" htmlFor={field.name}>
        {label}
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
        className="px-2 py-2 border border-gray-200 rounded-md outline-none shadow-sm shadow-gray-300 shadow-sm outline-none transition-all duration-300 focus:shadow-xl"
      />
      <FieldErrors field={field} />
    </div>
  );
};

export default NumberInput;
