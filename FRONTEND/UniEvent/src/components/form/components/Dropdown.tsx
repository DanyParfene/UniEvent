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
      <label className="font-[Sans-Source-Now] text-lg" htmlFor={field.name}>{label}</label>
      <select
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
        className="p-2 border border-gray-200 rounded-md font-[Sans-Source-Now]
                   shadow-sm focus:shadow-lg outline-none transition duration-300 cursor-pointer"
      >
        {values.map((value) => (
          <option key={value.name} value={value.name} className="font-[Sans-Source-Now]">
            {value.label}
          </option>
        ))}
      </select>
      <FieldErrors field={field} />
    </div>
  );
};

export default Dropdown;
