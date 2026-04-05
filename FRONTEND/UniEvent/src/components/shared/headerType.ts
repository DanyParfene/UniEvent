export const faculties: DropdownLink[] = [
  { label: "ARTE", to: "/facultati/arte" },
  { label: "CBG", to: "/facultati/cbg" },
  { label: "DREPT", to: "/facultati/drept" },
  { label: "FEEA", to: "/facultati/feea" },
  { label: "FEFS", to: "/facultati/fefs" },
  { label: "FFM", to: "/facultati/ffm" },
  { label: "INFO", to: "/facultati/info" },
  { label: "FLIFT", to: "/facultati/flift" },
  { label: "FMT", to: "/facultati/fmt" },
  { label: "FPSE", to: "/facultati/fpse" },
  { label: "FSAS", to: "/facultati/fsas" },
  { label: "FSGC", to: "/facultati/fsgc" },
];

export const eventActions: DropdownLink[] = [
  { label: "Adăugare eveniment", to: "/create-event" },
  { label: "Filtrare evenimente", to: "/filtrare-evenimente" },
  { label: "Completare post eveniment", to: "/evenimente/completare-post" },
  { label: "Arhivă", to: "/evenimente/arhiva" },
];

export const partnerActions: DropdownLink[] = [
  { label: "Adăugare partener", to: "/parteneri-adaugare" },
  { label: "Editare parteneri", to: "/parteneri-administrare" },
];

export const reportActions: DropdownLink[] = [
  { label: "Generare raport", to: "/rapoarte/generare" },
  { label: "Raport anual", to: "/rapoarte/anual" },
];

export type DropdownLink = {
    label: string;
    to: string;
};

export type Props = {
    title: string;
    to?: string;
    description: string;
    icon: React.ComponentType<{ className?: string}>;
    items: DropdownLink[];
    className?: string;
};

