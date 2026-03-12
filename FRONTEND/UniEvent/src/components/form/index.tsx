import { createFormHook } from "@tanstack/react-form";
import TextInput from "./components/TextInput";
import DateInput from "./components/DateInput";
import { fieldContext, formContext } from "./context";

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInput,
    DateInput,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
