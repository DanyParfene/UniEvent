import { useState } from "react";
import Input from "../common/Input";

const RegisterCard = () => {
  const faculties = [
    "Facultatea de Arte și Design",
    "Facultatea de Chimie, Biologie, Geografie",
    "Facultatea de Drept",
    "Facultatea de Economie și de Administrare a Afacerilor",
    "Facultatea de Educație Fizică și Sport",
    "Facultatea de Fizică și Matematică",
    "Facultatea de Litere, Istorie, Filosofie și Teologie",
    "Facultatea de Informatică",
    "Facultatea de Muzică și Teatru",
    "Facultatea de Psihologie și Științe ale Educației",
    "Facultatea de Sociologie și Asistență Socială",
    "Facultatea de Științe ale Guvernării și Comunicării",
  ];

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="w-full max-w-2xl bg-white border border-gray-200 px-6 py-8 sm:px-10 shadow-xl rounded-2xl flex flex-col min-h-[480px] h-auto">
      <div className="w-full pl-10 max-w-7xl mb-12 flex items-center flex-col">
        <h1 className="text-3xl md:text-4xl font-bold text-text-secondary tracking-tight">
          Înregistrare
        </h1>
        <div className="mt-2 h-1 w-20 bg-primary rounded-full" />
      </div>
      <div className="flex flex-col gap-4 w-[90%] max-w-md mx-auto">
        <Input label="Nume" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <Input label="Parolă" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <label className="text-sm font-bold text-gray-700 flex flex-col gap-1.5">
          Facultate
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:border-gray-400 bg-white appearance-none font-normal"
          >
            <option value="" disabled hidden>
              --Alege facultate--
            </option>

            {faculties.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-auto pt-8 flex justify-center flex-col items-center w-full">
        <button className="w-full sm:w-auto px-10 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm text-sm font-black text-primary hover:bg-primary hover:text-white transition-all transition-800 cursor-pointer active:scale-95">
          Înregistrare
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
    </div>
  );
};

export default RegisterCard;
