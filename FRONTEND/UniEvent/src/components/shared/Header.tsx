import shortLogo from "../../assets/uvt-short.png";
import AccountIcon from "../../assets/account-icon.svg?react";
import FacultyIcon from "../../assets/faculty.svg?react";
import EventIcon from "../../assets/event.svg?react";
import PartnerIcon from "../../assets/partner.svg?react";
import ReportIcon from "../../assets/report.svg?react";
import HeaderDropdown from "./HeaderDropdown";
import {
  eventActions,
  faculties,
  partnerActions,
  reportActions,
} from "./headerType";
import RedirectButton from "../common/RedirectButton";

const Header = () => {
  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-gradient-to-r from-primary to-secondary text-white shadow-md font-[Source_Sans_Pro]">
      <div className="relative mx-auto flex h-16 w-full items-center px-6">
          <RedirectButton to={"/dashboard"} className="w-6 h-6 hover:scale-105 transition-transform">
            <img src={shortLogo} alt="Logo-uvt" className="w-full h-full object-contain" />
          </RedirectButton>
        <nav className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-10 text-xl font-semibold">
            <HeaderDropdown
              title="Facultăți"
              description="Alege facultatea asupra căreia dorești să efectuezi acțiuni."
              icon={FacultyIcon}
              items={faculties}
              className="md:grid-cols-3 lg:grid-cols-4"
            />
            <HeaderDropdown
              title="Evenimente"
              to="/evenimente"
              description="Alege o acțiune din cele posibile pentru evenimente."
              icon={EventIcon}
              items={eventActions}
            />
            <HeaderDropdown
              title="Parteneri"
              to="/parteneri"
              description="Alege o acțiune din cele posibile pentru parteneri."
              icon={PartnerIcon}
              items={partnerActions}
            />
            <HeaderDropdown
              title="Rapoarte"
              description="Alege o acțiune din cele posibile pentru rapoarte."
              icon={ReportIcon}
              items={reportActions}
            />
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
