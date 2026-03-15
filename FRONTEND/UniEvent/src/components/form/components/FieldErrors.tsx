import type { AnyFieldApi } from "@tanstack/react-form";

const FieldErrors = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      {field.state.meta.errors.length > 0 && (
        <span className="mt-2 font-[Sans-Source-Now] text-primary">
          {field.state.meta.errors.map((error) => error.message).join("; ")}
        </span>
      )}
    </>
  );
};

export default FieldErrors;
