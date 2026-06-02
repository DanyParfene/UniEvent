const extractFileId = (url: string): string | null => {
  // Already a lh3.googleusercontent.com link — extract the ID
  const lh3Match = url.match(/lh[2-6]\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match) return lh3Match[1];

  // /file/d/{fileId}/... or /d/{fileId}/...
  const slashDMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (slashDMatch) return slashDMatch[1];

  // ?id={fileId} or &id={fileId}
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];

  return null;
};

export const getGoogleDriveDirectLink = (url: string, size = "w400"): string => {
  if (!url) return url;

  const fileId = extractFileId(url);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=${size}`;
  }

  return url;
};

type DriveImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  link: string;
  size?: string;
};

const DriveImage = ({ link, size, ...rest }: DriveImageProps) => {
  return <img src={getGoogleDriveDirectLink(link, size)} {...rest} />;
};

export default DriveImage;