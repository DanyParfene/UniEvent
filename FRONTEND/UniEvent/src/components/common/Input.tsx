type inputTypes = {
  label: string;
  type?: string;
};

const Input = ({ label, type }: inputTypes) => {
  return (
    <div className="flex flex-col">
      {label && <label className="font-bold">{label}</label>}
      <input
        className="rounded-md px-4 py-2 w-[clamp(150px,50vw,600px)] shadow-sm focus:outline-none focus:shadow-md hover:shadow-md focus:shadow-accent transition-all duration-300"
        type={type || "text"}
      />
    </div>
  );
};

export default Input;
