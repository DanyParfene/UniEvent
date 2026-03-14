type RedirectButtonType = {
  path: string;
  title?: string;
  image?: string;
};

const RedirectButton = ({ path, title, image }: RedirectButtonType) => {
  return (
    <button onClick={() => console.log(path)} className="px-6 py-2 w-fit rounded-md bg-secondary text-text-primary text-lg hover:shadow-lg hover:bg-primary hover:cursor-pointer transition-all duration-300">
      {title ? title : image ? <img src={image} /> : "button"}
    </button>
  );
};

export default RedirectButton;
