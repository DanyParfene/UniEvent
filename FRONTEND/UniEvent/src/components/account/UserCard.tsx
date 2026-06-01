import Input from "../common/Input";
import { useState } from "react";
import UsersList from "./UsersList";
import Accordion from "../common/Accordion";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "../../lib/axios";
import { AxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";

const UserCard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = user?.current_role === "super_administrator";

  const [originalName, setOriginalName] = useState(user?.name ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const buttonClass =
    "w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary hover:bg-primary hover:text-white transition-all cursor-pointer active:scale-95";

  const handleNameSubmit = () => {
    setNameError("");
    setNameSuccess("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError("Numele nu poate fi lăsat gol.");
      return;
    }

    if (trimmedName === originalName) {
      setNameError("Nu a fost introdus un nume diferit.");
      return;
    }

    setOriginalName(trimmedName);
    setNameSuccess("Numele a fost salvat!");
    setTimeout(() => setNameSuccess(""), 3000);
  };

  const handlePasswordSubmit = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Parolele noi nu coincid.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Noua parolă trebuie să aibă cel puțin 6 caractere.");
      return;
    }

    setIsPasswordLoading(true);
    try {
      await axiosInstance.post("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordSuccess("Parola a fost actualizată cu succes!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const axiosErr = err as AxiosError<{
        message: string;
        errors?: { old_password?: string[]; new_password?: string[] };
      }>;
      const errors = axiosErr.response?.data?.errors;
      if (errors?.old_password) {
        setPasswordError(errors.old_password[0]);
      } else if (errors?.new_password) {
        setPasswordError(errors.new_password[0]);
      } else {
        setPasswordError(
          axiosErr.response?.data?.message || "A apărut o eroare.",
        );
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/conectare" });
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col h-auto">
      <div className="w-full pl-10 max-w-7xl mb-12 flex items-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight">
          Setări Cont
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
      </div>

      <div className="flex flex-col gap-10 w-[90%] max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text-secondary mb-2">
            Schimbă Numele
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-end gap-3 w-full">
            <div className="flex-1 w-full">
              <Input
                label="Nume"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button onClick={handleNameSubmit} className={buttonClass}>
                Salvează numele
              </button>
            </div>
          </div>

          {nameError && (
            <p className="text-red-500 text-sm font-medium">{nameError}</p>
          )}
          {nameSuccess && (
            <p className="text-green-600 text-sm font-medium">{nameSuccess}</p>
          )}
        </div>

        <div className="w-full h-px bg-gray-200"></div>

        <Accordion title="Schimbare parolă">
          <div className="flex flex-col gap-4">
            <Input
              label="Parolă veche"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              label="Noua parolă"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirmă noua parolă"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {passwordError && (
              <p className="text-red-500 text-sm font-medium mt-1">
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-green-600 text-sm font-medium mt-1">
                {passwordSuccess}
              </p>
            )}

            <div className="mt-4 flex justify-center w-full">
              <button
                onClick={handlePasswordSubmit}
                className={buttonClass}
                disabled={isPasswordLoading}
              >
                {isPasswordLoading ? "Se salvează..." : "Salvează parola"}
              </button>
            </div>
          </div>
        </Accordion>

        {isSuperAdmin && (
          <>
            <div className="w-full h-px bg-gray-200"></div>
            <UsersList />
          </>
        )}

        <div className="w-full h-px bg-gray-200"></div>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-8 py-3 bg-white border border-red-200 rounded-2xl shadow-sm text-sm font-black text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            Deconectare
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
