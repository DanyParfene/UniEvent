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
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="font-[Sans-Source-Now] text-lg" htmlFor={field.name}>
        {label}
      </label>
      <div className="flex flex-col gap-5">
        <input
          className="px-2 py-2 border border-gray-200 rounded-md text-sm shadow-gray-300 shadow-sm outline-none transition-all duration-300 focus:shadow-xl"
          id={field.name}
          type="text"
          ref={inputRef}
          {...props}
        />
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
          className="cursor-pointer bg-secondary rounded-md px-5 py-2 text-sm text-text-primary shadow-sm font-semibold transition-all duration-300 hover:bg-primary"
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
              className="font-[Sans-Source-Now] text-lg text-secondary hover:text-primary hover:font-semibold transition duration-300 cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <FieldErrors field={field} />
    </div>
  );
};

export default ArrayInput;
