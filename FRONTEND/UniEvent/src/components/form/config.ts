import type React from "react";

export type Element<T extends object> = {
  name: keyof T;
  label: string;
} & (
  | ({
      type: "textInput" | "dateInput" | "arrayInput" | "numberInput";
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({
      type: "dropdown";
      values: {
        name: string;
        label: string;
      }[];
    } & React.SelectHTMLAttributes<HTMLSelectElement>)
  | ({
      type: "radioGroup";
      values: {
        name: string;
        label: string;
      }[];
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | ({
      type: "textAreaInput";
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
);
