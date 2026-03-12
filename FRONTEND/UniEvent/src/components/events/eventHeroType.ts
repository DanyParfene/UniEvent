export type Field = { label: string; value: any };

export type Section = {
  sectionTitle: string;
  fields: Field[];
};

export const eventData: Section[] = [
  {
    sectionTitle: "Date generale",
    fields: [
      { label: "Denumire eveniment", value: "Conferința Tech 2026" },
      { label: "Dată eveniment", value: "15.05.2026" },
      { label: "Ediție", value: "Ediția a 10-a" },
      { label: "Organizator", value: "Universitatea de Vest din Timișoara" },
    ],
  },
  {
    sectionTitle: "Detalii",
    fields: [
      {
        label: "Descriere",
        value: "Un eveniment despre viitorul AI în educația universitară.",
      },
      { label: "Locație", value: "Aula Magna UVT" },
      { label: "Invitați", value: "Andrei Terbea, Maria Popescu" },
      { label: "Mod organizare", value: "Hibrid" },
    ],
  },
  {
    sectionTitle: "Participare",
    fields: [
      { label: "Număr estimat participanți", value: 450 },
      { label: "Grup țintă", value: "Studenți, Profesori, Parteneri IT" },
      { label: "Livestream", value: "DA" },
    ],
  },
  {
    sectionTitle: "Contact",
    fields: [
      { label: "Coordonator", value: "Popescu Ion" },
      { label: "Email", value: "ion.popescu@e-uvt.ro" },
      { label: "Telefon", value: "+40 722 123 456" },
    ],
  },
  {
    sectionTitle: "Parteneri eveniment",
    fields: [
      { label: "Parteneri", value: "Google, Microsoft, BCR, Continental" },
    ],
  },
  {
    sectionTitle: "Alte informații",
    fields: [
      {
        label: "Informații suplimentare",
        value: "Accesul se face pe bază de înregistrare prealabilă.",
      },
      { label: "Afiș eveniment", value: "https://uvt.ro/afis.pdf" },
    ],
  },
  {
    sectionTitle: "Media & Social Media",
    fields: [
      { label: "Album foto", value: "https://photos.google.com/album123" },
      { label: "Facebook UVT", value: "https://facebook.com/uvt/post1" },
      { label: "Instagram", value: "https://instagram.com/uvt/post2" },
      { label: "TikTok", value: "https://tiktok.com/@uvt/video3" },
      { label: "Comunicat de presă", value: "https://uvt.ro/comunicat-presa" },
      { label: "Apariții în presă", value: "Digi24, Tion, Radio Timișoara" },
      { label: "Statistici", value: "Reach: 15.000, Engagement: 1.200" },
      { label: "Link Podcast", value: "https://spotify.com/uvt-podcast" },
    ],
  },
];
