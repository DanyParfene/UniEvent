import { createFormHook } from "@tanstack/react-form";
import TextInput from "./components/TextInput";
import DateInput from "./components/DateInput";
import { fieldContext, formContext } from "./context";
import Dropdown from "./components/Dropdown";
import RadioGroup from "./components/RadioGroup";
import ArrayInput from "./components/ArrayInput";
import NumberInput from "./components/NumberInput";
import TextAreaInput from "./components/TextAreaInput";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInput,
    DateInput,
    Dropdown,
    RadioGroup,
    ArrayInput,
    NumberInput,
    TextAreaInput,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
