import { useState, type ReactNode } from "react";
import arrowUp from "../../assets/arrow-up.svg";
import arrowDown from "../../assets/arrow-down.svg";

interface SimpleAccordionProps {
  title: string;
  children: ReactNode;
  styles?: string;
  initialOpenValue?: boolean;
}

const Accordion = ({ title, children, styles = "", initialOpenValue = false }: SimpleAccordionProps) => {
  const [isOpen, setIsOpen] = useState(initialOpenValue);

  return (
    <div className={`w-full border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden ${styles}`}>
      <button
        type="button" // Este o bună practică să specificăm type="button" pentru butoanele care nu fac submit
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <img 
          src={isOpen ? arrowUp : arrowDown} 
          alt={isOpen ? "Închide" : "Deschide"} 
          className="w-5 h-5 opacity-70"
        />
      </button>

      {isOpen && (
        <div className="p-5 border-t border-gray-100 bg-white">
           {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;