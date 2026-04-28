import type {FacultyId} from "../../context/FacultyContext.tsx";

export const faculties: DropdownLink[] = [
  { label: "ARTE", id: "ARTE", to: "/facultati/arte" },
  { label: "CBG", id: "CBG", to: "/facultati/cbg" },
  { label: "DREPT", id: "DREPT", to: "/facultati/drept" },
  { label: "FEAA", id: "FEAA", to: "/facultati/feaa" },
  { label: "FEFS", id: "FEFS", to: "/facultati/fefs" },
  { label: "FFM", id: "FFM", to: "/facultati/ffm" },
  { label: "INFO", id: "INFO", to: "/facultati/info" },
  { label: "FLIFT", id: "FLIFT", to: "/facultati/flift" },
  { label: "FMT", id: "FMT", to: "/facultati/fmt" },
  { label: "FPSE", id: "FPSE", to: "/facultati/fpse" },
  { label: "FSAS", id: "FSAS", to: "/facultati/fsas" },
  { label: "FSGC", id: "FSGC", to: "/facultati/fsgc" },
];

export type DropdownLink = {
    label: string;
    to: string;
    id: FacultyId;
};

export type Props = {
    title: string;
    to?: string;
    description: string;
    icon: React.ComponentType<{ className?: string}>;
    items: DropdownLink[];
    className?: string;
    onClick?: () => void;
};

