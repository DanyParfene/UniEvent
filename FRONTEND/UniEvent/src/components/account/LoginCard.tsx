import Input from "../common/Input";
import { useState } from "react";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col  h-auto">
      <div className="w-full pl-10 max-w-7xl mb-12 flex items-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight">
          Conectare
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
      </div>
      <div className="flex flex-col gap-4 w-[90%] max-w-md mx-auto">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Parolă"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="mt-auto pt-8 flex justify-center w-full flex-col items-center w-full">
        <button className="w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary hover:bg-primary hover:text-white transition-all cursor-pointer active:scale-95">
          Conectare
        </button>
        <div className="flex pt-4 gap-1">
          Nu aveți cont?
          <a
            href="inregistrare"
            className="underline text-secondary cursor-pointer hover:text-primary flex flex-row"
          >
            Creeați-vă cont
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
