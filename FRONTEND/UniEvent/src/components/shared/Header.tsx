import shortLogo from "../../assets/uvt-short.png";
import AccountIcon from "../../assets/account-icon.svg?react";
import FacultyIcon from "../../assets/faculty.svg?react";
import EventIcon from "../../assets/event.svg?react";
import PartnerIcon from "../../assets/partner.svg?react";
import ReportIcon from "../../assets/report.svg?react";
import HeaderDropdown from "./HeaderDropdown";
import { faculties } from "./headerType";
import { Link } from "@tanstack/react-router";
import { useFaculty } from "../../context/FacultyContext";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { state } = useFaculty();
  const { currentFaculty } = state;
  const { user } = useAuth();

  const isSuperAdmin = user?.current_role === "super_administrator";

  let filteredFaculties = faculties.filter((f) => f.id !== currentFaculty);

  if (currentFaculty !== "UVT") {
    filteredFaculties = [
      { id: "UVT", label: "UVT", to: "/dashboard" },
      ...filteredFaculties,
    ];
  }

  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-linear-to-r from-primary to-secondary text-white shadow-md">
      <div className="relative mx-auto flex h-16 w-full items-center px-6">
        <Link to={"/dashboard"} className="w-6 h-6">
          <img
            src={shortLogo}
            alt="Logo-uvt"
            className="w-full h-full object-contain"
          />
        </Link>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-10 text-xl font-bold">
            {isSuperAdmin && (
              <HeaderDropdown
                title="Facultăți"
                description="Alege facultatea asupra căreia dorești să efectuezi acțiuni."
                icon={FacultyIcon}
                items={filteredFaculties}
                className="md:grid-cols-3 lg:grid-cols-4"
                onClick={() => {}}
              />
            )}

            <li>
              <Link
                to="/evenimente"
                search={{
                  page: 1,
                }}
                className="flex h-16 w-10 md:w-auto items-center transition-all hover:scale-105 cursor-pointer"
              >
                <EventIcon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary" />
                <h3 className="hidden md:block">Evenimente</h3>
              </Link>
            </li>
            <li>
              <Link
                to="/parteneri"
                className="flex h-16 w-10 md:w-auto items-center transition-all hover:scale-105 cursor-pointer"
              >
                <PartnerIcon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary" />
                <h3 className="hidden md:block">Parteneri</h3>
              </Link>
            </li>
            <li>
              <Link
                to="/rapoarte"
                className="flex h-16 w-10 md:w-auto items-center transition-all hover:scale-105 cursor-pointer"
              >
                <ReportIcon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary" />
                <h3 className="hidden md:block">Rapoarte</h3>
              </Link>
            </li>
          </ul>
        </nav>

        <Link
          to="/cont"
          className="flex justify-center items-center ml-auto cursor-pointer transition-colors"
        >
          <AccountIcon className="w-9 h-9 fill-text-primary" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
