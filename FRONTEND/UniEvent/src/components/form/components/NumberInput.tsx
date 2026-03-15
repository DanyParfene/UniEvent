import type React from "react";
import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const NumberInput = ({ label, ...props }: Props) => {
  const field = useFieldContext<number>();

  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <input
        id={field.name}
        type="text"
        value={field.state.value}
        onChange={(e) => {
          const value = Number(e.target.value);
          field.handleChange(!isNaN(value) ? value : 0);
        }}
        {...props}
      />
      <FieldErrors field={field} />
    </>
  );
};

export default NumberInput;
