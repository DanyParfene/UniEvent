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
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-gray-800">{title}</span>
        <img 
          src={isOpen ? arrowUp : arrowDown} 
          alt={isOpen ? "Collapse section" : "Expand section"} 
          className="w-5 h-5 opacity-70"
        />
      </button>

      <Activity mode={isOpen ? "visible" : "hidden"}>
        <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100 flex flex-col gap-5">
          {children}
        </div>
      </Activity>
    </div>
  );
};

export default Accordion;