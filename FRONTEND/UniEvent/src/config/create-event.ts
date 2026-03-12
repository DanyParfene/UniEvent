import z from "zod";

export const formSchema = z.object({
  eventName: z
    .string()
    .max(200, "The name of the event must be maximum 200 characters"),
  eventDate: z.iso.date('The event needs to be a valid date'),
  edition: z.number(),
  organizer: z.string(),
  description: z.string(),
  targetGroup: z.string(),
});

type Form = z.infer<typeof formSchema>;

export const defaultFormValues: Form = {
  eventName: "",
  eventDate: new Date().toLocaleDateString("en-CA"),
  edition: 1,
  organizer: "",
  description: "",
  targetGroup: ""
};

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
        label: "Editia",
        name: "edition",
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
  {
    name: "Participare",
    elements: [
      {
        type: "textInput",
        label: "Grup Tinta",
        name: "targetGroup"
      }
    ]
  }
];
