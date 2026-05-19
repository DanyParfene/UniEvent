import { useFieldContext } from "../context";
import FieldErrors from "./FieldErrors";

type Props = {
  label: string;
  values: {
    name: string;
    label: string;
  }[];
} & React.InputHTMLAttributes<HTMLInputElement>;

const RadioGroup = ({ label, values, ...props }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <label className="text-sm font-bold text-gray-700" htmlFor={field.name}>{label}</label>
      <div id={field.name}>
        {values.map((value) => (
          <div className="flex items-center" key={value.name}>
            <input
              type="radio"
              id={value.name}
              value={value.name}
              name={field.name}
              onChange={(e) => field.handleChange(e.target.value)}
              checked={field.state.value == value.name ? true : false}
              {...props}
              className="cursor-pointer accent-primary"
            />
            <label className="text-sm p-2" htmlFor={value.name}>{value.label}</label>
          </div>
        ))}
      </div>
      <FieldErrors field={field} />
    </>
  );
};

export default RadioGroup;
