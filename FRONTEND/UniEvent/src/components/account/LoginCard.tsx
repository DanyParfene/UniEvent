import { useState } from "react";
import Input from "../common/Input";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "@tanstack/react-router";

interface LoginPayload {
  email: string;
  password: string;
}

const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginPayload) => {
      const response = await axiosInstance.post("/auth/login", data);
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

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { mutate, error, isError } = useLogin();

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!email) errors.email = "Câmp obligatoriu.";
    if (!password) errors.password = "Câmp obligatoriu.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;

    mutate({
      email,
      password,
    });
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col h-auto">
      <div className="w-full pl-10 max-w-7xl mb-12 flex items-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight">
          Conectare
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
      </div>

      {isError && (
        <div className="w-[90%] max-w-md mx-auto mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {(error as AxiosError<{ message: string }>).response?.data?.message ||
            "Eroare la conectare."}
        </div>
      )}

      <div className="flex flex-col gap-4 w-[90%] max-w-md mx-auto">
        <div className="flex flex-col w-full gap-1">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <span className="mt-2 font-[Sans-Source-Now] text-primary">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex flex-col w-full gap-1">
            <Input
              label="Parolă"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <span className="mt-2 font-[Sans-Source-Now] text-primary">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div className="flex justify-end w-full">
            <a
              href="/recuperare-parola"
              className="text-sm font-medium text-secondary hover:text-primary transition-colors hover:underline"
            >
              Ați uitat parola?
            </a>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 flex justify-center w-full flex-col items-center">
        <button
          onClick={handleLogin}
          className="w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary hover:bg-primary hover:text-white transition-all cursor-pointer active:scale-95"
        >
          Conectare
        </button>
        <div className="flex pt-4 gap-1 text-sm sm:text-base text-gray-600">
          Nu aveți cont?
          <a
            href="/inregistrare"
            className="underline text-secondary cursor-pointer hover:text-primary font-medium"
          >
            Creeați-vă cont
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
