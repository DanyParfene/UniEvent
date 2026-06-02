import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Câmp obligatoriu.")
    .max(255, "Numele nu poate depăși 255 de caractere."),
  email: z
    .string()
    .min(1, "Câmp obligatoriu.")
    .max(255, "Email-ul nu poate depăși 255 de caractere.")
    .regex(/.+@e-uvt\.ro$/i, "Email-ul trebuie să aparțină domeniului @e-uvt.ro."),
  password: z.string().min(1, "Câmp obligatoriu."),
  department: z.string().min(1, "Vă rugăm să selectați o facultate."),
});

export type RegisterForm = z.infer<typeof registerSchema>;

export const defaultRegisterValues: RegisterForm = {
  name: "",
  email: "",
  password: "",
  department: "",
};

export const faculties = [
  { name: "ARTE", label: "Facultatea de Arte și Design" },
  { name: "CBG", label: "Facultatea de Chimie, Biologie, Geografie" },
  { name: "DREPT", label: "Facultatea de Drept" },
  { name: "FEAA", label: "Facultatea de Economie și de Administrare a Afacerilor" },
  { name: "FEFS", label: "Facultatea de Educație Fizică și Sport" },
  { name: "FFM", label: "Facultatea de Fizică și Matematică" },
  { name: "FLIFT", label: "Facultatea de Litere, Istorie, Filosofie și Teologie" },
  { name: "INFO", label: "Facultatea de Informatică" },
  { name: "FMT", label: "Facultatea de Muzică și Teatru" },
  { name: "FPSE", label: "Facultatea de Psihologie și Științe ale Educației" },
  { name: "FSAS", label: "Facultatea de Sociologie și Asistență Socială" },
  { name: "FSGC", label: "Facultatea de Științe ale Guvernării și Comunicării" },
];
