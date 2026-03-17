import { Activity, useState, type ReactNode } from "react";
import arrowUp from "../../assets/arrow-up.svg";
import arrowDown from "../../assets/arrow-down.svg";

interface SimpleAccordionProps {
  title: string;
  children: ReactNode;
  styles?: string;
  initialOpenValue?: boolean
}

const Accordion = ({ title, children, styles = "", initialOpenValue }: SimpleAccordionProps) => {
  const [isOpen, setIsOpen] = useState(initialOpenValue);

  return (
    <div className={styles + " w-full border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden "}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className=" font-medium text-gray-800">{title}</span>
        <img 
          src={isOpen ? arrowUp : arrowDown} 
          alt={isOpen ? "Închide" : "Deschide"} 
          className="w-5 h-5 opacity-70"
        />
      </button>

      <Activity mode={isOpen ? "visible" : "hidden"}>
        <div className="py-5 text-sm text-gray-600 border-gray-100 flex flex-col justify-center items-center gap-5">
          {children}
        </div>
      </Activity>
    </div>
  );
};

export default Accordion;