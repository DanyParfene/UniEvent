import CustomActiveShapePieChart from "./PieChart";
import longLogo from "../../assets/uvt-long.png";
import nokiaLogo from "../../assets/nokia_logo.png";
import PressIcon from "../../assets/press.svg?react";

const Bento = () => {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4 h-auto md:h-[750px]">
        
        <div className="md:col-span-1 md:row-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-center items-center h-full">
          <h3 className="text-gray-400 text-xs text-xl mb-4 uppercase">Următoarele 5 evenimente</h3>
          <ul className="">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex items-center gap-3 p-3 rounded-xl transition-colors">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-medium text-text-secondary italic">Eveniment {i}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-1 md:row-span-1 bg-gradient-to-bl from-secondary to-primary rounded-3xl p-6 flex items-center justify-center text-white text-4xl font-black shadow-lg h-full">
          <img src={longLogo} alt="UVT" className="p-6"/>
        </div>

        <div className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-secondary to-primary rounded-3xl p-6 flex flex-col justify-center h-full">
          <p className="text-blue-100 text-xs uppercase tracking-wider">Cel mai implicat organizator</p>
          <p className="text-text-primary font-bold text-lg">Ion Vasile</p>
        </div>

        <div className="md:col-span-1 md:row-span-2 rounded-3xl p-8 flex flex-col items-center justify-center text-white shadow-sm border border-gray-200 h-full">
          <p className="text-gray-400 text-xs uppercase mb-2">Cel mai implicat sponsor</p>
          <div>
            <img src={nokiaLogo} alt="logo" className="p-6" />
          </div>
        </div>

        <div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-4 shadow-sm border border-gray-200 flex flex-col items-center justify-center h-full">
             <CustomActiveShapePieChart/>
        </div>

        <div className="md:col-span-1 md:row-span-2 rounded-3xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center h-full">
          <h3 className="mb-4 text-gray-400 text-xs uppercase">Apariții în presă în ultima lună</h3>
          <p className="text-4xl font-black text-text-secondary">2.000</p>
          <PressIcon className="fill-text-secondary w-20 h-20 m-2"/>
          
        </div>

        <div className="md:col-span-2 md:row-span-1 bg-gradient-to-b from-secondary to-primary rounded-3xl p-6 flex items-center justify-between h-full">
          <div>
            <p className="text-blue-100 text-xs uppercase">Cel mai mare nr. participanți</p>
            <p className="text-4xl font-black text-text-primary">5.000</p>
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