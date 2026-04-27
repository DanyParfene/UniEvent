type inputTypes = {
  label: string;
  type?: string;
};

const Input = ({ label, type = "text" }: inputTypes) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-bold text-gray-700">{label}</label>}
      <input
        className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-all duration-300 focus:border-[#033a89] focus:outline-none focus:ring-1 focus:ring-[#033a89] hover:border-gray-400 bg-white"
        type={type}
      />
    </div>
  );
};

export default Input;