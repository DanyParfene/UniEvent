import CustomActiveShapePieChart from "./PieChart";
import longLogo from "../../assets/uvt-long.png";
import PressIcon from "../../assets/press.svg?react";
import { Link } from "@tanstack/react-router";

interface BentoStats {
  upcomingEvents: string[];
  userName: string;
  topOrganiser: string;
  topSponsorLogo: string;
  pressAppearances: number;
  maxParticipants: number;
  chartData: { name: string; value: number }[];
}

const Bento = ({ stats }: { stats: BentoStats }) => {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4 h-auto md:h-[750px]">
        <div className="md:col-span-1 md:row-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-start items-center h-full">
          <h1 className="text-text-secondary text-2xl font-bold px-2 py-15">Bună, {stats.userName}</h1>
          <h3 className="text-gray-400 text-xs mt-7 mb-5 uppercase">
            Următoarele 5 evenimente
          </h3>
          <ul className="w-full">
            {stats.upcomingEvents.length > 0 ? (
              stats.upcomingEvents.map((eventName, index) => (
                <li
                  key={index}
                >
                  <Link to={"/eveniment"} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-blue-50 group cursor-pointer">
                    <span className="w-2 h-2 rounded-full bg-secondary shrink-0 transition-transform duration-300 group-hover:scale-150"></span>
                    <span className="font-medium text-text-secondary italic group-hover:text-primary transition-colors duration-300">
                      {eventName}
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center">
                Niciun eveniment viitor.
              </p>
            )}
          </ul>
        </div>

        <div className="md:col-span-1 md:row-span-1 bg-gradient-to-bl from-secondary to-primary rounded-3xl p-6 flex items-center justify-center text-white text-4xl font-black h-full">
          <img src={longLogo} alt="UVT" className="p-6" />
        </div>

        <div className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-secondary to-primary rounded-3xl p-6 flex flex-col justify-center h-full">
          <p className="text-blue-100 text-xs uppercase tracking-wider">
            Cel mai implicat organizator
          </p>
          <p className="text-text-primary font-bold text-lg">
            {stats.topOrganiser}
          </p>
        </div>

        <div className="md:col-span-1 md:row-span-2 rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-sm border border-gray-200 h-full">
          <p className="text-gray-400 text-xs uppercase mb-2">
            Cel mai implicat sponsor
          </p>
          <div>
            <img src={stats.topSponsorLogo} alt="logo" className="p-6" />
          </div>
        </div>

        <div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center h-full">
          <CustomActiveShapePieChart chartData={stats.chartData} />
        </div>

        <div className="md:col-span-1 md:row-span-2 rounded-3xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center h-full">
          <h3 className="mb-4 text-gray-400 text-xs uppercase">
            Apariții în presă în ultima lună
          </h3>
          <p className="text-4xl font-black text-text-secondary">
            {stats.pressAppearances.toLocaleString("ro-RO")}
          </p>
          <PressIcon className="fill-text-secondary w-20 h-20 m-2" />
        </div>

        <div className="md:col-span-2 md:row-span-1 bg-gradient-to-b from-secondary to-primary rounded-3xl p-6 flex items-center justify-between h-full">
          <div>
            <p className="text-blue-100 text-xs uppercase">
              Cel mai mare nr. participanți
            </p>
            <p className="text-4xl font-black text-text-primary">
              {stats.maxParticipants.toLocaleString("ro-RO")}
            </p>
          </div>
          <div className="h-12 w-12 bg-text-primary rounded-full flex items-center justify-center text-secondary font-bold text-xl">
            ↑
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bento;
