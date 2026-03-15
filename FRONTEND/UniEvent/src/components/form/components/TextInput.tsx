import type React from "react";
import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({ label, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <div className="flex flex-col gap-1.5 mb-4">
        <label htmlFor={field.name}>{label}</label>
        <input
          id={field.name}
          type="text"
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          {...props}
          className="w-full rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        />
        <FieldErrors field={field} />
      </div>
    </>
  );
};

export default TextInput;
