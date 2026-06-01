import Input from "../common/Input";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { axiosInstance } from "../../lib/axios";
import { AxiosError } from "axios";

const RecoverPasswordCard = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const buttonClass =
    "w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary hover:bg-primary hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const handleSendCode = async () => {
    setError("");
    setSuccess("");

    if (!email.includes("@") || email.length < 5) {
      setError("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setSuccess("Dacă există un cont asociat acestui email, codul a fost trimis!");
      setTimeout(() => {
        setSuccess("");
        setStep(2);
      }, 1500);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ||
          "A apărut o eroare. Te rugăm să încerci din nou.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!code) {
      setError("Te rugăm să introduci codul primit pe email.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", {
        email,
        email_token: code,
        new_password: newPassword,
      });

      setSuccess(
        "Parola a fost schimbată! Vei fi redirecționat la conectare în câteva secunde...",
      );
      setIsRedirecting(true);
      setCode("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate({ to: "/conectare" });
      }, 3000);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ||
          "Codul este invalid sau a expirat. Te rugăm să încerci din nou.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col h-auto">
      <div className="w-full pl-10 max-w-7xl mb-12 flex items-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight text-center">
          Recuperare Parolă
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
      </div>

      <div className="flex flex-col gap-5 w-[90%] max-w-md mx-auto">
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm text-gray-600 text-center mb-2">
              Introduceți adresa de email asociată contului pentru a primi un
              cod de recuperare.
            </p>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isRedirecting}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm text-gray-600 text-center mb-2">
              Am trimis un cod către{" "}
              <span className="font-bold text-gray-900">{email}</span>.
            </p>

            <Input
              label="Cod de recuperare"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading || isRedirecting}
            />
            <Input
              label="Noua parolă"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading || isRedirecting}
            />
            <Input
              label="Confirmă noua parolă"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || isRedirecting}
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm font-medium text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm font-medium text-center">
            {success}
          </p>
        )}
      </div>

      <div className="mt-auto pt-10 flex justify-center w-full flex-col items-center">
        {step === 1 ? (
          <button
            onClick={handleSendCode}
            className={buttonClass}
            disabled={isLoading || isRedirecting}
          >
            {isLoading ? "Se trimite..." : "Trimite codul"}
          </button>
        ) : (
          <button
            onClick={handleResetPassword}
            className={buttonClass}
            disabled={isLoading || isRedirecting}
          >
            {isRedirecting
              ? "Se redirecționează..."
              : isLoading
                ? "Se salvează..."
                : "Salvează noua parolă"}
          </button>
        )}

        <div className="flex pt-6 gap-1 text-sm sm:text-base text-gray-600">
          V-ați amintit parola?
          <a
            href="/conectare"
            className="underline text-secondary cursor-pointer hover:text-primary font-medium"
          >
            Înapoi la conectare
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecoverPasswordCard;
