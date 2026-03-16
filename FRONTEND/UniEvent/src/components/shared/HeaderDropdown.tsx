import type { Props } from "./headerType";
import { Link } from "@tanstack/react-router";

const HeaderDropdown = ({
  title,
  description,
  icon: Icon,
  items,
  className,
}: Props) => {
  return (
    <li className="group relative">
      <span className="flex h-16 w-10 md:w-auto items-center transition-all duration-300 ease-out hover:scale-105 cursor-pointer">
        <Icon className="block size-6 min-w-6 min-h-6 shrink-0 md:hidden fill-text-primary" />
        <span className="hidden md:block">{title}</span>
      </span>
      <div className="invisible fixed left-0 top-full w-full translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
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
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block w-full rounded-md px-3 py-2 font-semibold duration-200 hover:text-primary"
                  >
                    {item.label}
                  </Link>
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
