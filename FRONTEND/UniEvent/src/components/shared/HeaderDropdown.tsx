import { useEffect, useRef, useState } from "react";
import type { Props } from "./headerType";
import { useFaculty } from "../../context/FacultyContext";

const HeaderDropdown = ({
  title,
  description,
  icon: Icon,
  items,
  className,
  onClick,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeoutRef = useRef<number | null>(null);

  const { changeFaculty } = useFaculty();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex h-16 w-10 md:w-auto items-center transition-all hover:scale-105 cursor-pointer">
        <Icon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary border" />
        <h3 className="hidden md:block" onClick={onClick}>
          {title}
        </h3>
      </div>
      <div
        className={`fixed left-0 top-full w-full transition-all duration-150 ease-out 
          ${isOpen ? "visible opacity-100 translate-y-0 pointer-events-auto" : "invisible opacity-0 pointer-events-none"}
        `}
      >
        <div className="border-t border-slate-200 bg-white text-gray-800 shadow-xl rounded-b-2xl">
          <div className="mx-auto max-w-7xl px-10 py-8">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-primary">{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>

            <ul
              className={`grid grid-cols-2 gap-x-10 gap-y-3 ${className || ""}`}
            >
              {items.map((item) => (
                <li
                  key={item.to}
                  onClick={() => {
                    changeFaculty(item.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="block w-full rounded-md px-3 py-2 font-semibold duration-200 hover:text-primary cursor-pointer">
                    {item.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
};

export default HeaderDropdown;
