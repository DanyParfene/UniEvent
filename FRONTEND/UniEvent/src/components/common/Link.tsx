import LinkImage from '../../assets/link.svg?react';

const Link = ({ link }: { link: string }) => {

  return (
    <a href={link} target="_blank" className="underline text-secondary cursor-pointer hover:text-primary flex flex-row">
      <LinkImage/> Link
    </a>
  );
};

export default Link;
