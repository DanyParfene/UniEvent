import { type ComponentProps, type ReactNode } from "react";

type ActionButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
  className?: string;
};

const ActionButton = ({
  children,
  className = "",
  type = "button",
  ...props
}: ActionButtonProps) => {
  return (
    <button
      type={type}
      className={`${className} inline-flex items-center justify-center gap-2 font-medium w-fit`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
