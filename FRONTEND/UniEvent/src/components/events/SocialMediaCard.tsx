import { useState } from "react";
import Link from "../common/Link";
import ActionButton from "../common/ActionButton";

type SocialMediaCardTypes = {
  link: string;
  reach: number;
  engagement: number;
  setLink?: () => void;
  setReach?: () => void;
  setEngagement?: () => void;
};

const SocialMediaCard = ({
  link,
  reach,
  engagement,
  setLink,
  setReach,
  setEngagement,
}: SocialMediaCardTypes) => {
  const [localLink, setLocalLink] = useState(link);
  const [localReach, setLocalReach] = useState(reach);
  const [localEngagement, setLocalEngagement] = useState(engagement);
  const [isEditMode, setIsEditMode] = useState(false);
  return isEditMode ? (
    <div className="rounded-lg shadow-sm px-4 py-2 flex flex-col border-2 border-red-500 justify-between items-center hover:shadow-md transition-all duration-300 w-full">
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Link</span>
        <input
          className="px-2 py-2 border border-gray-200 rounded-md text-sm shadow-gray-300 shadow-sm outline-none transition-all duration-300 focus:shadow-md"
          value={localLink}
          onChange={(e) => setLocalLink(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Reach</span>
        <input
          value={localReach}
          onChange={(e) => setLocalReach(parseInt(e.target.value))}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Engagement</span>
        <input
          value={localEngagement}
          onChange={(e) => setLocalEngagement(parseInt(e.target.value))}
        />
      </label>
      <ActionButton action={() => setIsEditMode(true)}>Edit</ActionButton>
    </div>
  ) : (
    <div className="rounded-lg shadow-sm px-4 py-2 flex flex-col justify-between items-center hover:shadow-md transition-all duration-300 w-full md:flex-row lg:flex-row">
      <Link link={link} />
      <label className="flex flex-row md:flex-col lg:flex-col gap-2">
        <span className="font-semibold">Reach</span>
        {reach}
      </label>
      <label className="flex flex-row md:flex-col lg:flex-col gap-2">
        <span className="font-semibold">Engagement</span>
        {engagement}
      </label>
      <ActionButton action={() => setIsEditMode(true)}>Edit</ActionButton>
    </div>
  );
};

export default SocialMediaCard;
