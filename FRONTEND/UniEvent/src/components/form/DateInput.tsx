import type React from "react";
import { useFieldContext } from "./index";

type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const DateInput = ({ label, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <input
        id={field.name}
        type="date"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
      {field.state.meta.errors.length > 0 && <p>errors</p>}
    </>
  );
};

export default DateInput;
