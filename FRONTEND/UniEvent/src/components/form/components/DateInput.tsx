import type React from "react";
import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const DateInput = ({ label, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-lg font-[Sans-Source-Now]" htmlFor={field.name}>
        {label}
      </label>
      <input
        id={field.name}
        type="date"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
        className="px-2 py-2 border border-gray-200 shadow-sm rounded-md outline-none focus:shadow-lg transition duration-300"
      />
      <FieldErrors field={field} />
    </div>
  );
};

export default DateInput;
