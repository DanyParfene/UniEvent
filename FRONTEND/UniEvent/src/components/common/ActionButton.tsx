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
  const baseClasses =
    "transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center";

  return (
    <button
      type={type}
      onClick={action}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
