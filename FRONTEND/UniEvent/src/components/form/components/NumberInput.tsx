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
        type="number"
        value={field.state.value}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        {...props}
      />
      <FieldErrors field={field} />
    </>
  );
};

export default NumberInput;
