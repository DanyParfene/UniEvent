
export const getGoogleDriveDirectLink = (url: string): string => {
  if (!url) return url;

  // Handle /file/d/{fileId}/... and /d/{fileId}/... formats
  const slashDMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (slashDMatch) {
    return `https://drive.google.com/thumbnail?id=${slashDMatch[1]}&sz=w400`;
  }

  // Handle ?id={fileId} and &id={fileId} formats
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) {
    return `https://drive.google.com/thumbnail?id=${idParamMatch[1]}&sz=w400`;
  }

  return url;
};

type DriveImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  link: string;
};

const DriveImage = ({ link, ...rest }: DriveImageProps) => {
  return <img src={getGoogleDriveDirectLink(link)} {...rest} />;
};

export default DriveImage;