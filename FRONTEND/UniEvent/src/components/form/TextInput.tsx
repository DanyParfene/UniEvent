import type React from "react";
import { useFieldContext } from "./index";

type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({ label, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <input
        id={field.name}
        type="text"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      />
    </>
  );
};

export default TextInput;
