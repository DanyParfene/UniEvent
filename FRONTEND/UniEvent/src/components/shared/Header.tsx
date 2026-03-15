import shortLogo from "../../assets/uvt-short.png";
import AccountIcon from "../../assets/account-icon.svg?react";
import FacultyIcon from "../../assets/faculty.svg?react";
import EventIcon from "../../assets/event.svg?react";
import PartnerIcon from "../../assets/partner.svg?react";
import ReportIcon from "../../assets/report.svg?react";

const faculties = [
  "ARTE",
  "CBG",
  "DREPT",
  "FEEA",
  "FEFS",
  "FFM",
  "INFO",
  "FLIFT",
  "FMT",
  "FPSE",
  "FSAS",
  "FSGC",
];

const eventActions = [
  "Adăugare Eveniment",
  "Filtrare Evenimente",
  "Completare Post Eveniment",
  "Arhivă",
];

const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gradient-to-r from-primary to-secondary text-white shadow-md font-[Source_Sans_Pro]">
      <div className="relative mx-auto flex h-16 w-full items-center px-6">
        <div className="flex items-center justify-center w-10 h-10 cursor-pointer">
          <img src={shortLogo} alt="Logo-uvt" />
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-10 text-xl font-semibold">
            <li className="group relative">
              <span className="flex h-16 w-10 md:w-auto items-center transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                <FacultyIcon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary" />
                <span className="hidden md:block">Facultăți</span>
              </span>
              <div className="invisible fixed left-0 top-full w-full translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="border-t border-slate-200 bg-white text-gray-800 shadow-xl rounded-b-2xl">
                  <div className="mx-auto max-w-7xl px-10 py-8">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-primary">
                        Facultăți
                      </h3>
                      <p className="text-sm text-slate-500">
                        Alege facultatea asupra căreia dorești să efectuezi
                        acțiuni.
                      </p>
                    </div>

                    <ul className="grid grid-cols-2 gap-x-10 gap-y-3 md:grid-cols-3 lg:grid-cols-4">
                      {faculties.map((faculty) => (
                        <li key={faculty}>
                          <div className="w-full rounded-md px-3 py-2 font-semibold transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                            {faculty}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li className="group relative">
              <span className="flex h-16 w-10 md:w-auto items-center transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                <EventIcon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary" />
                <span className="hidden md:block">Evenimente</span>
              </span>
              <div className="invisible fixed left-0 top-16 w-full translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="border-t border-slate-200 bg-white text-gray-800 shadow-xl rounded-b-2xl">
                  <div className="mx-auto max-w-7xl px-10 py-8">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-primary">
                        Evenimente
                      </h3>
                      <p className="text-sm text-slate-500">
                        Alege o acțiune din cele posibile pentru evenimente.
                      </p>
                    </div>

                    <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
                      {eventActions.map((action) => (
                        <li key={action}>
                          <div className="w-full rounded-md px-3 py-2 font-semibold transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                            {action}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li className="group relative">
              <span className="flex h-16 w-10 md:w-auto items-center transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                <PartnerIcon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary" />
                <span className="hidden md:block">Parteneri</span>
              </span>
              <div className="invisible fixed left-0 top-16 w-full translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="border-t border-slate-200 bg-white text-gray-800 shadow-xl rounded-b-2xl">
                  <div className="mx-auto max-w-7xl px-10 py-8">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-primary">
                        Parteneri
                      </h3>
                      <p className="text-sm text-slate-500">
                        Alege o acțiune din cele posibile pentru parteneri.
                      </p>
                    </div>

                    <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
                      <li>
                        <div className="w-full rounded-md px-3 py-2 font-semibold transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                          Adăugare Partener
                        </div>
                      </li>
                      <li>
                        <div className="w-full rounded-md px-3 py-2 font-semibold transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                          Editare Parteneri
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li className="group relative">
              <span className="flex h-16 w-10 md:w-auto items-center transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                <ReportIcon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary" />
                <span className="hidden md:block">Rapoarte</span>
              </span>
              <div className="invisible fixed left-0 top-16 w-full translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="border-t border-slate-200 bg-white text-gray-800 shadow-xl rounded-b-2xl">
                  <div className="mx-auto max-w-7xl px-10 py-8">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-primary">
                        Rapoarte
                      </h3>
                      <p className="text-sm text-slate-500">
                        Alege o acțiune din cele posibile pentru rapoarte.
                      </p>
                    </div>

                    <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
                      <li>
                        <div className="w-full rounded-md px-3 py-2 font-semibold transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                          Generare Raport
                        </div>
                      </li>
                      <li>
                        <div className="w-full rounded-md px-3 py-2 font-semibold transition-all duration-300 ease-out hover:scale-105 hover:font-bold cursor-pointer">
                          Raport Anual
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        <span className="flex justify-center items-center ml-auto cursor-pointer transition-colors">
          <AccountIcon className="w-10 h-16 fill-text-primary" />
        </span>
      </div>
    </header>
  );
};

export default Header;
