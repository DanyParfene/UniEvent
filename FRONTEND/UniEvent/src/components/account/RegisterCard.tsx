import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useAppForm } from "../form";
import {
  registerSchema,
  defaultRegisterValues,
  faculties,
} from "../../config/inregistrare";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  department: string;
}

const useRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterPayload) => {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      const userData = data.data.user;
      const accessToken = data.data.access_token;

      login(userData, accessToken);
      navigate({ to: "/dashboard" });
    },
  });
};

const RegisterCard = () => {
  const register = useRegister();

  const form = useAppForm({
    defaultValues: defaultRegisterValues,
    validators: {
      onChange: registerSchema,
    },
    onSubmit: ({ value }) => {
      register.mutate(value);
    },
  });

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col min-h-[480px] h-auto">
      <div className="w-full pl-10 max-w-7xl mb-12 flex items-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight">
          Înregistrare
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
      </div>

      {register.isError && (
        <div className="w-[90%] max-w-md mx-auto mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {(register.error as AxiosError<{ message: string }>).response?.data
            ?.message || "Eroare la înregistrare."}
        </div>
      )}

      <form
        className="flex flex-col flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col w-[90%] max-w-md mx-auto">
          <form.AppField
            name="name"
            children={(field) => <field.TextInput label="Nume" isRequired />}
          />
          <form.AppField
            name="email"
            children={(field) => <field.TextInput label="Email" isRequired />}
          />
          <form.AppField
            name="password"
            children={(field) => (
              <field.TextInput label="Parolă" type="password" isRequired />
            )}
          />
          <form.AppField
            name="department"
            children={(field) => (
              <field.Dropdown
                label="Facultate"
                values={faculties}
                placeholder="--Alege facultate--"
                isRequired
              />
            )}
          />
        </div>

        <div className="mt-auto pt-8 flex justify-center flex-col items-center w-full">
          <button
            type="submit"
            disabled={register.isPending}
            className="w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary hover:bg-primary hover:text-white transition-all transition-800 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {register.isPending ? "Se înregistrează..." : "Înregistrare"}
          </button>
          <div className="flex pt-4 gap-1">
            Aveți deja cont?
            <a
              href="conectare"
              className="underline text-secondary cursor-pointer hover:text-primary flex flex-row"
            >
              Conectați-vă
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterCard;
