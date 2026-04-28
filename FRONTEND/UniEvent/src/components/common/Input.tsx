import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
const Input = ({ label, type = "text", ...props}: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-bold text-gray-700">{label}</label>}
      <input
        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:border-gray-400 bg-white"
        type={type}
        {...props}
      />
    </div>
  );
};

export default Input;