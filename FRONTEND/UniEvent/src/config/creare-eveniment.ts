import z from "zod";
import type { Element } from "../components/form/config";

export const formSchema = z
  .object({
    // Obligatorii
    eventName: z.string().min(1, "Denumirea este obligatorie").max(200, "Maximum 200 caractere"),
    startEventDate: z.string().min(1, "Data de început este obligatorie"),
    finishEventDate: z.string().min(1, "Data de final este obligatorie"),
    edition: z.number().min(1, "Ediția minimă este 1"),
    organizer: z.string().min(1, "Organizatorul este obligatoriu"),
    description: z.string().min(1, "Descrierea este obligatorie").max(1000, "Max 1000 caractere"),
    location: z.string().min(1, "Locația este obligatorie"),
    targetGroup: z.string().min(1, "Grupul țintă este obligatoriu"),
    coordinator: z.string().min(1, "Coordonatorul este obligatoriu"),
    organizationMode: z.enum(["physical", "hybrid", "online"]),
    livestream: z.enum(["YES", "NO"]),
    numberOfParticipants: z.number().min(1, "Minim 1").max(10000, "Maxim 10000"),
    email: z
      .string()
      .min(1, "Email-ul este obligatoriu")
      .email("Format invalid")
      .refine(
        (val) => /^[a-z]+\.[a-z]+(?:\d{2})@e-uvt\.ro$/.test(val),
        "This is not a valid e-uvt email",
      ),
    telephone: z
      .string()
      .min(12, "The phone number is not valid")
      .refine(
        (val) => val.substring(0, 3) === "+40" && !isNaN(Number(val.substring(3))),
        "The phone number is not valid",
      ),

    // Opționale
    banner: z.string().optional(),
    otherInformation: z.string().max(500, "Max 500 caractere").optional(),
    invitations: z.array(z.string()).optional(),
    partners: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.startEventDate) > new Date(data.finishEventDate)) {
      ctx.addIssue({
        code: "custom",
        message: "Start date must be before end date",
        path: ["step1 | date"],
      });
    }
  });

export type Form = z.infer<typeof formSchema>;

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
  partners: [],
};

export type Step = {
  name: string;
  elements: Element<Form>[];
};

export const formSteps: Step[] = [
  {
    name: "Date generale",
    elements: [
      { type: "textInput", label: "Afis", name: "banner", isRequired: false },
      { type: "textInput", label: "Denumire eveniment", name: "eventName", isRequired: true },
      { type: "dateInput", label: "Data inceput eveniment", name: "startEventDate", isRequired: true },
      { type: "dateInput", label: "Data final eveniment", name: "finishEventDate", isRequired: true },
      { type: "numberInput", label: "Editia", name: "edition", isRequired: true },
      { type: "textInput", label: "Organizator", name: "organizer", isRequired: true },
    ],
  },
  {
    name: "Detalii",
    elements: [
      { type: "textInput", label: "Descriere", name: "description", isRequired: true },
      { type: "textInput", label: "Locatie", name: "location", isRequired: true },
      { type: "arrayInput", label: "Invitati", name: "invitations", isRequired: false },
      { type: "dropdown", label: "Mod organizare", name: "organizationMode", isRequired: true, values: [ { name: "physical", label: "Fizic" }, { name: "hybrid", label: "Hibrid" }, { name: "online", label: "Online" } ] },
    ],
  },
  {
    name: "Participare",
    elements: [
      { type: "numberInput", label: "Numar estimat participanti", name: "numberOfParticipants", isRequired: true },
      { type: "textInput", label: "Grup Tinta", name: "targetGroup", isRequired: true },
      { type: "radioGroup", label: "Livestream", name: "livestream", isRequired: true, values: [ { label: "DA", name: "YES" }, { label: "NU", name: "NO" } ] },
    ],
  },
  {
    name: "Contact",
    elements: [
      { type: "textInput", label: "Coordonator", name: "coordinator", isRequired: true },
      { type: "textInput", label: "Email", name: "email", isRequired: true },
      { type: "textInput", label: "Telefon", name: "telephone", isRequired: true },
    ],
  },
  {
    name: "Parteneri",
    elements: [
      { type: "multiCheckboxInput", label: "Selectează partenerii evenimentului", name: "partners", isRequired: false },
    ],
  },
  {
    name: "Alte informatii",
    elements: [
      { type: "textAreaInput", label: "Alte Informatii", name: "otherInformation", isRequired: false },
    ],
  },
];