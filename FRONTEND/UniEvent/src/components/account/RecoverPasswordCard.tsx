import Input from "../common/Input";
import { useState } from "react";
// Importăm hook-ul de navigare din TanStack Router
import { useNavigate } from "@tanstack/react-router";

const RecoverPasswordCard = () => {
  // Inițializăm funcția de navigare
  const navigate = useNavigate();

  // Gestionăm pașii: 1 = cere email, 2 = introdu cod și parolă nouă
  const [step, setStep] = useState<1 | 2>(1);
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Adăugăm un state pentru a bloca butoanele în timp ce se face redirecționarea
  const [isRedirecting, setIsRedirecting] = useState(false);

  const buttonClass = "w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary hover:bg-primary hover:text-white transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const handleSendCode = () => {
    setError("");
    
    if (!email.includes("@") || email.length < 5) {
      setError("Te rugăm să introduci o adresă de email validă.");
      return;
    }

    // TODO: Apel backend
    setSuccess("Codul a fost trimis pe adresa ta de email!");
    
    setTimeout(() => {
      setSuccess("");
      setStep(2);
    }, 1500);
  };

  const handleResetPassword = () => {
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

    // TODO: Apel backend pentru resetare
    
    // Setăm starea de succes și blocăm interfața
    setSuccess("Parola a fost schimbată! Vei fi redirecționat la conectare în câteva secunde...");
    setIsRedirecting(true);
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    
    // Redirecționare automată după 3 secunde către ruta de conectare
    setTimeout(() => {
      navigate({ to: '/conectare' }); // Asigură-te că '/conectare' este ruta ta corectă
    }, 3000);
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col h-auto">
      
      {/* Header */}
      <div className="w-full pl-10 max-w-7xl mb-12 flex items-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight text-center">
          Recuperare Parolă
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-5 w-[90%] max-w-md mx-auto">
        
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm text-gray-600 text-center mb-2">
              Introduceți adresa de email asociată contului pentru a primi un cod de recuperare.
            </p>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isRedirecting}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm text-gray-600 text-center mb-2">
              Am trimis un cod către <span className="font-bold text-gray-900">{email}</span>.
            </p>
            
            <Input
              label="Cod de recuperare"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isRedirecting}
            />
            <Input
              label="Noua parolă"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isRedirecting}
            />
            <Input
              label="Confirmă noua parolă"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isRedirecting}
            />
          </div>
        )}

        {/* Mesaje de stare */}
        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm font-medium text-center">{success}</p>}
      </div>

      {/* Footer / Actions */}
      <div className="mt-auto pt-10 flex justify-center w-full flex-col items-center">
        {step === 1 ? (
          <button 
            onClick={handleSendCode} 
            className={buttonClass}
            disabled={isRedirecting}
          >
            Trimite codul
          </button>
        ) : (
          <button 
            onClick={handleResetPassword} 
            className={buttonClass}
            disabled={isRedirecting}
          >
            {isRedirecting ? "Se redirecționează..." : "Salvează noua parolă"}
          </button>
        )}

        <div className="flex pt-6 gap-1 text-sm sm:text-base text-gray-600">
          V-ați amintit parola?
          {/* Este recomandat să folosim componenta Link din TanStack Router pentru navigare declarativă, dar și tag-ul a cu un simplu href merge în funcție de configurare */}
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