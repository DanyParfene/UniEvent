type inputTypes = {
  label: string;
  type?: string;
};

const Input = ({ label, type }: inputTypes) => {
  return (
    <div className="flex flex-col">
      {label && <label className="text-lg font-bold">{label}</label>}
      <input
        className="border rounded-md px-4 py-2 text-lg w-[clamp(150px,50vw,600px)] "
        type={type || "text"}
      />
    </div>
  );
};

export default Input;
