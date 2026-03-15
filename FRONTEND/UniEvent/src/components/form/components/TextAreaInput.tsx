import type React from "react";
import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaInput = ({ label, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-[Sans-Source-Now] text-lg" htmlFor={field.name}>{label}</label>
      <textarea
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
        className="h-36 px-3 py-2 border border-gray-200 outline-none rounded-md shadow-ms font-[Sans-Source-Now] resize-none focus:shadow-xl transition-all duration-300"
      />
      <FieldErrors field={field} />
    </div>
  );
};

export default TextAreaInput;
