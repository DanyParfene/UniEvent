import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
  values: {
    name: string;
    label: string;
  }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Dropdown = ({ label, values, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <div className="flex flex-col gap-1.5 mt-4">
      <label className="text-sm font-bold text-gray-700" htmlFor={field.name}>{label}</label>
      <select
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
        className="p-2 border border-gray-200 rounded-md text-sm
                   shadow-sm focus:shadow-lg outline-none transition duration-300 cursor-pointer"
      >
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
