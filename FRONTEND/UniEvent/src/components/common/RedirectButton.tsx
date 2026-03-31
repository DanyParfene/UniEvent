import { Link, type LinkProps } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { type ComponentProps } from "react";

type RedirectButtonProps = LinkProps & Omit<ComponentProps<"a">, "href"> & {
  children: ReactNode;
  className?: string;
};

const RedirectButton = ({
  to,
  children,
  className = "",
  ...props
}: RedirectButtonProps) => {
  return (
    <Link
      to={to}
      className={`${className} inline-flex items-center justify-center gap-2 font-medium w-fit`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default RedirectButton;
