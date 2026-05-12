import Input from "../common/Input";
import { useState } from "react";
import UsersList from "./UsersList";

interface UserCardProps {
  currentUserRole?: "Coordonator" | "Administrator de Departament" | "Super Administrator";
}

const UserCard = ({ currentUserRole = "Super Administrator" }: UserCardProps) => {
  // --- Name State ---
  const [originalName, setOriginalName] = useState("Popescu Ion"); // Reprezintă numele actual (din DB)
  const [name, setName] = useState(originalName); // Reprezintă ce tastează utilizatorul
  const [nameSuccess, setNameSuccess] = useState("");   
  const [nameError, setNameError] = useState("");

  // --- Password State ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // --- Status State ---
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Reusable button styling to exactly match the LoginCard
  const buttonClass = "w-full sm:w-auto px-8 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary hover:bg-primary hover:text-white transition-all cursor-pointer active:scale-95";

  // --- Handlers ---
  const handleNameSubmit = () => {
    // Resetăm mesajele anterioare
    setNameError("");
    setNameSuccess("");

    const trimmedName = name.trim();

    // 1. Validare: Numele nu poate fi gol
    if (!trimmedName) {
      setNameError("Numele nu poate fi lăsat gol.");
      return;
    }

    // 2. Validare: Numele trebuie să fie diferit de cel vechi
    if (trimmedName === originalName) {
      setNameError("Nu a fost introdus un nume diferit.");
      return;
    }

    // 3. Simulare apel backend
    // TODO: Send new name to database here
    
    // 4. Succes: Actualizăm originalName cu noua valoare salvată
    setOriginalName(trimmedName);
    setNameSuccess("Numele a fost salvat!");
    setTimeout(() => setNameSuccess(""), 3000); // Ascunde mesajul după 3 secunde
  };

  const handlePasswordSubmit = () => {
    // Reset previous messages
    setPasswordError("");
    setPasswordSuccess("");

    // 1. Frontend Validation: Check if new passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("Parolele noi nu coincid.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Noua parolă trebuie să aibă cel puțin 6 caractere.");
      return;
    }

    // 2. Backend Validation Simulation
    const MOCK_DATABASE_PASSWORD = "parolaveche123"; 
    
    if (oldPassword !== MOCK_DATABASE_PASSWORD) {
      setPasswordError("Parola veche este incorectă.");
      return;
    }

    // 3. Success state
    setPasswordSuccess("Parola a fost actualizată cu succes!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col h-auto">
      
      {/* Header */}
      <div className="w-full pl-10 max-w-7xl mb-12 flex items-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight">
          Setări Cont
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
      </div>

      <div className="flex flex-col gap-10 w-[90%] max-w-md mx-auto">
        
        {/* --- NAME SECTION --- */}
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
              <button 
                onClick={handleNameSubmit} 
                className={buttonClass}
              >
                Salvează numele
              </button>
            </div>
          </div>

          {/* Error & Success Messages pentru Nume */}
          {nameError && (
            <p className="text-red-500 text-sm font-medium">{nameError}</p>
          )}
          {nameSuccess && (
            <p className="text-green-600 text-sm font-medium">{nameSuccess}</p>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200"></div>

        {/* --- PASSWORD SECTION --- */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-text-secondary mb-2">
            Schimbă Parola
          </h2>
          
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

          {/* Error & Success Messages pentru Parolă */}
          {passwordError && (
            <p className="text-red-500 text-sm font-medium mt-1">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-green-600 text-sm font-medium mt-1">{passwordSuccess}</p>
          )}

          <div className="mt-4 flex justify-center w-full">
            <button 
              onClick={handlePasswordSubmit} 
              className={buttonClass}
            >
              Salvează parola
            </button>
          </div>
        </div>

          {currentUserRole === "Super Administrator" && (
          <>
            <div className="w-full h-px bg-gray-200"></div>
            <UsersList />
          </>
        )}

      </div>
    </div>
  );
};

export default UserCard;