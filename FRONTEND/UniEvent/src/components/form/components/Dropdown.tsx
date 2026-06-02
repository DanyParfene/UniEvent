import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  values: {
    name: string;
    label: string;
  }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Dropdown = ({ label, values, placeholder, isRequired, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      <label className="text-sm font-bold text-gray-700" htmlFor={field.name}>
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:border-gray-400 bg-white appearance-none cursor-pointer"
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {values.map((value) => (
          <option key={value.name} value={value.name} className="text-sm">
            {value.label}
          </option>
        ))}
      </select>
      <FieldErrors field={field} />
    </div>
  );
};

export default Dropdown;
