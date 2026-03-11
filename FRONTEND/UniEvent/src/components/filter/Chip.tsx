import CloseImg from "../../assets/close.svg";
import SmallImg from "../common/SmallImg";

type Props = {
  value: string;
  onClose: () => void;
};

const Chip = ({ value, onClose }: Props) => {
  return (
    <div>
      <SmallImg image={CloseImg} onClick={onClose}/>
      {value}
    </div>
  );
};

export default Chip;
