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
  { label: "Adăugare Eveniment", to: "/evenimente/adaugare" },
  { label: "Filtrare Evenimente", to: "/evenimente/filtrare" },
  { label: "Completare Post Eveniment", to: "/evenimente/completare-post" },
  { label: "Arhivă", to: "/evenimente/arhiva" },
];

export const partnerActions: DropdownLink[] = [
  { label: "Adăugare Partener", to: "/parteneri/adaugare" },
  { label: "Editare Parteneri", to: "/parteneri/editare" },
];

export const reportActions: DropdownLink[] = [
  { label: "Generare Raport", to: "/rapoarte/generare" },
  { label: "Raport Anual", to: "/rapoarte/anual" },
];

export type DropdownLink = {
    label: string;
    to: string;
};

export type Props = {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string}>;
    items: DropdownLink[];
    className?: string;
};

