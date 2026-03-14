import type React from "react";
import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaInput = ({ label, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <textarea
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      <FieldErrors field={field} />
    </>
  );
};

export default TextAreaInput;
