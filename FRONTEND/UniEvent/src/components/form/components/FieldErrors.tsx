import type { AnyFieldApi } from "@tanstack/react-form";

const FieldErrors = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      {field.state.meta.errors.length > 0 && (
        <span>
          {field.state.meta.errors.map((error) => error.message).join("; ")}
        </span>
      )}
    </>
  );
};

export default FieldErrors;
