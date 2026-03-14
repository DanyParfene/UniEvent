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
      <label htmlFor={field.name}>{label}</label>
      <div id={field.name}>
        {values.map((value) => (
          <div key={value.name}>
            <input
              type="radio"
              id={value.name}
              value={value.name}
              name={field.name}
              onChange={(e) => field.handleChange(e.target.value)}
              checked={field.state.value == value.name ? true : false}
              {...props}
            />
            <label htmlFor={value.name}>{value.label}</label>
          </div>
        ))}
      </div>
      <FieldErrors field={field} />
    </>
  );
};

export default RadioGroup;
