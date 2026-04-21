import { type ComponentProps, type ReactNode } from "react";

type ActionButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
  action: () => void;
  className?: string;
};

const ActionButton = ({
  children,
  action,
  className = "",
  type = "button",
  ...props
}: ActionButtonProps) => {
  return (
    <button
      type={type}
      onClick={action}
      className={`${className} mt-6 sm:mt-0 sm:ml-6 w-full sm:w-auto px-8 py-3 
                        bg-white border border-gray-200 rounded-2xl shadow-sm 
                        text-sm font-black text-[#033a89] 
                        transition-all duration-300 
                        hover:bg-[#033a89] hover:text-white cursor-pointer 
                        active:scale-95 shrink-0`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
