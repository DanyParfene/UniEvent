import z from "zod";
import TextInput from "../components/form/TextInput";
import DateInput from "../components/form/DateInput";
import type { AnyFieldApi } from "@tanstack/react-form";

export const formSchema = z.object({
  eventName: z
    .string()
    .max(200, "The name of the event must be maximum 200 characters"),
  eventDate: z.date(),
  organizer: z.string(),
  description: z.string(),
});

type Form = z.infer<typeof formSchema>;

export const defaultFormValues: Form = {
  eventName: "",
  eventDate: new Date(),
  organizer: "",
  description: "",
};

export const map = {
     
}

export const componentsMap = {
  textInput: TextInput,
  dateInput: DateInput,
};

export const getComponent = (field: AnyFieldApi, type: Element["type"], props) => {
    const Component = componentsMap[type];

    return <field.Component {...props} />
}


export type Element = {
  type: "textInput" | "dateInput";
  name: keyof Form;
  label: string;
};

export type Step = {
  name: string;
  elements: Element[];
};

export const formSteps: Step[] = [
  {
    name: "Date generale",
    elements: [
      {
        type: "textInput",
        label: "Denumire eveniment",
        name: "eventName",
      },
      {
        type: "dateInput",
        label: "Data eveniment",
        name: "eventDate",
      },
      {
        type: "textInput",
        label: "Organizator",
        name: "organizer",
      },
    ],
  },
  {
    name: "Detalii",
    elements: [
      {
        type: "textInput",
        label: "Descriere",
        name: "description",
      },
    ],
  },
];
