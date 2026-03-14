import type React from "react";
import { useFieldContext } from "../context";
import { useRef } from "react";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const ArrayInput = ({ label, ...props }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useFieldContext<string[]>();

  return (
    <>
      <label htmlFor={field.name}>{label}</label>
      <input id={field.name} type="text" ref={inputRef} {...props} />
      <button
        type="button"
        onClick={() => {
          if (inputRef.current == null || inputRef.current.value == "") {
            return;
          }
          const value = inputRef.current.value;
          if (field.state.value.some((val) => val === value)) {
            return;
          }
          field.handleChange((prev) => [...prev, value]);
          inputRef.current.value = "";
        }}
      >
        Add
      </button>
      {field.state.value.map((el) => (
        <div key={el}>
          <p>{el}</p>
          <button
            onClick={() =>
              field.handleChange((prev) => prev.filter((val) => val != el))
            }
          >
            Delete
          </button>
        </div>
      ))}
      <FieldErrors field={field} />
    </>
  );
};

export default ArrayInput;
