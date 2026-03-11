import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import TextInput from "./TextInput";
import DateInput from "./DateInput";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInput,
    DateInput,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
