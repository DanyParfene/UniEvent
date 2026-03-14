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
    <>
      <label htmlFor={field.name}>{label}</label>
      <select
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        {...props}
      >
        {values.map((value) => (
          <option key={value.name} value={value.name}>
            {value.label}
          </option>
        ))}
      </select>
      <FieldErrors field={field} />
    </>
  );
};

export default Dropdown;
