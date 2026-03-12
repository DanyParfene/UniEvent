import shortLogo from "../../assets/uvt-short.png";
import accountIcon from "../../assets/account-icon.svg";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full  bg-gradient-to-r from-[#033A89] to-[#2588E7] text-[#F5F7FA] shadow-md font-[Source_Sans_Pro]">
      <div className="relative mx-auto flex h-16 w-full items-center px-6">

        <div className="flex items-center justify-center w-10 h-10 cursor-pointer">
          <img src={shortLogo} alt="Logo-uvt" />
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center justify-between gap-10 text-xl font-semibold">
            <li className="relative group cursor-pointer transition-colors hover:text-[#AED9F8]">
              Facultăți
              <ul className="absolute left-0 top-full w-screen hidden bg-white text-gray-800 shadow-lg group-hover:block">
                <li>Arte</li>
                <li>CBG</li>
                <li>DREPT</li>
                <li>FEEA</li>
                <li>FEFS</li>
                <li>FFM</li>
                <li>INFO</li>
                <li>FLIFT</li>
                <li>FMT</li>
                <li>FPSE</li>
                <li>FSAS</li>
                <li>FSGC</li>
              </ul>
            </li>
            <li className="cursor-pointer transition-colors hover:text-[#AED9F8]">
              Evenimente
            </li>
            <li className="cursor-pointer transition-colors hover:text-[#AED9F8]">
              Parteneri
            </li>
            <li className="cursor-pointer transition-colors hover:text-[#AED9F8]">
              Rapoarte
            </li>
          </ul>
        </nav>

        <span className="flex jusitfy-center items-center ml-auto cursor-pointer transition-colors">
          <img className="w-10 h-10" src={accountIcon} alt="Account" />
        </span>

      </div>
    </header>
  );
};

export default Header;