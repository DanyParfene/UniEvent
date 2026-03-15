import CloseImg from "../../assets/close.svg?react";

type Props = {
  value: string ;
  onClose: () => void;
};

const Chip = ({ value, onClose }: Props) => {
  return (
    <div className="flex flex-row rounded-full px-3 py-1 gap-1 shadow-sm hover:shadow-md bg-accent text-text-secondary items-center">
      <CloseImg onClick={onClose} className="h-5 w-5 cursor-pointer"/>
      {value}
    </div>
  );
};

export default Chip;
