
const getGoogleDriveDirectLink = (url: string): string => {
  const regex = /\/d\/([^/]+)/;
  const match = url.match(regex);
  const fileId = match ? match[1] : null;

  if (!fileId) return url;

  return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
};

const DriveImage = ({link}:{link:string}) =>{
    return <img src={getGoogleDriveDirectLink(link)}/>
}

export default DriveImage;