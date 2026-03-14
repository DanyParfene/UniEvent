import type React from "react";
import z from "zod";

export const formSchema = z.object({
  eventName: z
    .string()
    .max(200, "The name of the event must be maximum 200 characters"),
  startEventDate: z.iso.date("The event date meeds to be a valid one"),
  finishEventDate: z.iso.date("The event date needs to be a valid one"),
  edition: z.number(),
  organizer: z.string(),
  description: z.string().max(1000, "The maximum number of characters is 1000"),
  targetGroup: z.string(),
  coordinator: z.string(),
  location: z.string(),
  organizationMode: z.enum(["physical", "hybrid", "online"]),
  livestream: z.enum(["YES", "NO"]),
  invitations: z.array(z.string()),
  numberOfParticipants: z
    .number()
    .min(1, "Minimum number of participants is 1")
    .max(10000, "Maximum number of participants is 10000"),
  email: z.email().refine((val) => {
    val.endsWith("@e-uvt.ro");
  }),
  telephone: z
    .string()
    .min(12, "The phone number is not valid")
    .refine(
      (val) => !isNaN(Number(val.substring(3))),
      "The phone number is not valid",
    ),
  otherInformation: z
    .string()
    .max(500, "The maximum number of characters is 500"),
  banner: z.string(),
});

type Form = z.infer<typeof formSchema>;

export const defaultFormValues: Form = {
  eventName: "",
  startEventDate: new Date().toLocaleDateString("en-CA"),
  finishEventDate: new Date().toLocaleDateString("en-CA"),
  edition: 1,
  organizer: "",
  description: "",
  targetGroup: "",
  coordinator: "",
  location: "",
  organizationMode: "physical",
  livestream: "NO",
  invitations: [],
  numberOfParticipants: 1,
  email: "",
  telephone: "+40",
  otherInformation: "",
  banner: "",
};

export type Element = {
  name: keyof Form;
  label: string;
} & (
  | ({
      type: "textInput" | "dateInput" | "arrayInput" | "numberInput";
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({
      type: "dropdown";
      values: {
        name: string;
        label: string;
      }[];
    } & React.SelectHTMLAttributes<HTMLSelectElement>)
  | ({
      type: "radioGroup";
      values: {
        name: string;
        label: string;
      }[];
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({
      type: "textAreaInput";
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
);

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
        label: "Afis",
        name: "banner",
      },
      {
        type: "textInput",
        label: "Denumire eveniment",
        name: "eventName",
      },
      {
        type: "dateInput",
        label: "Data inceput eveniment",
        name: "startEventDate",
      },
      {
        type: "dateInput",
        label: "Data final eveniment",
        name: "finishEventDate",
      },
      {
        type: "numberInput",
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
      {
        type: "textInput",
        label: "Locatie",
        name: "location",
      },
      {
        type: "arrayInput",
        label: "Invitati",
        name: "invitations",
      },
      {
        type: "dropdown",
        label: "Mod organizare",
        name: "organizationMode",
        values: [
          { name: "fizic", label: "Fizic" },
          { name: "hybrid", label: "Hibrid" },
          { name: "online", label: "Online" },
        ],
      },
    ],
  },
  {
    name: "Participare",
    elements: [
      {
        type: "numberInput",
        label: "Numar estimat participanti",
        name: "numberOfParticipants",
      },
      {
        type: "textInput",
        label: "Grup Tinta",
        name: "targetGroup",
      },
      {
        type: "radioGroup",
        label: "Livestream",
        name: "livestream",
        values: [
          {
            label: "DA",
            name: "YES",
          },
          {
            label: "NU",
            name: "NO",
          },
        ],
      },
    ],
  },
  {
    name: "Contact",
    elements: [
      {
        type: "textInput",
        label: "Coordonator",
        name: "coordinator",
      },
      {
        type: "textInput",
        label: "Email",
        name: "email",
      },
      {
        type: "textInput",
        label: "Telefon",
        name: "telephone",
        defaultValue: "+40",
      },
    ],
  },
  {
    name: "Alte informatii",
    elements: [
      {
        type: "textAreaInput",
        label: "Alte Informatii",
        name: "otherInformation",
      },
    ],
  },
];
