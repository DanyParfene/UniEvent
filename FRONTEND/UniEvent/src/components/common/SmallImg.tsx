type Props = {
  image: string;
  onClick?: () => void;
};

const SmallImg = ({ image, onClick }: Props) => {
  return <img src={image} onClick={onClick} />;
};

export default SmallImg;
