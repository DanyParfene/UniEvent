type SocialMediaLink = {
  link: string;
  reach: number;
  engagement: number;
};

type Field = { label: string; value: string | number | SocialMediaLink[] };

export const bannerLabel = "Afiș eveniment";

type Section = {
  sectionTitle: string;
  fields: Field[];
};

export const eventData: Section[] = [
  {
    sectionTitle: "Date generale",
    fields: [
      { label: "Denumire eveniment", value: "Conferința Tech 2026" },
      { label: bannerLabel, value: "https://drive.google.com/file/d/1Og0Z_OVBbmOvgn8WS5ZwmxIaP3pqOWIt/view?usp=sharing" },
      { label: "Dată eveniment", value: "15.05.2026" },
      { label: "Oră eveniment", value: "13:00" },
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
    ],
  },
  {
    sectionTitle: "Social Media",
    fields: [
      {
        label: "Album foto",
        value: [
          {
            link: "https://photos.google.com/album123",
            reach: 1000,
            engagement: 89,
          },
          {
            link: "https://photos.google.com/album1234",
            reach: 899,
            engagement: 17,
          },
          {
            link: "https://photos.google.com/album12345",
            reach: 27058,
            engagement: 154,
          },
        ],
      },
      {
        label: "Facebook UVT",
        value: [
          {
            link: "https://photos.google.com/album123",
            reach: 1000,
            engagement: 89,
          },
          {
            link: "https://photos.google.com/album1234",
            reach: 899,
            engagement: 17,
          },
          {
            link: "https://photos.google.com/album12345",
            reach: 27058,
            engagement: 154,
          },
        ],
      },
      {
        label: "Instagram",
        value: [
          {
            link: "https://photos.google.com/album123",
            reach: 1000,
            engagement: 89,
          },
          {
            link: "https://photos.google.com/album1234",
            reach: 899,
            engagement: 17,
          },
          {
            link: "https://photos.google.com/album12345",
            reach: 27058,
            engagement: 154,
          },
        ],
      },
      {
        label: "TikTok",
        value: [
          {
            link: "https://photos.google.com/album123",
            reach: 1000,
            engagement: 89,
          },
          {
            link: "https://photos.google.com/album1234",
            reach: 899,
            engagement: 17,
          },
          {
            link: "https://photos.google.com/album12345",
            reach: 27058,
            engagement: 154,
          },
        ],
      },
      {
        label: "Comunicat de presă",
        value: [
          {
            link: "https://photos.google.com/album123",
            reach: 1000,
            engagement: 89,
          },
          {
            link: "https://photos.google.com/album1234",
            reach: 899,
            engagement: 17,
          },
          {
            link: "https://photos.google.com/album12345",
            reach: 27058,
            engagement: 154,
          },
        ],
      },
      {
        label: "Apariții în presă",
        value: [
          {
            link: "https://photos.google.com/album123",
            reach: 1000,
            engagement: 89,
          },
          {
            link: "https://photos.google.com/album1234",
            reach: 899,
            engagement: 17,
          },
          {
            link: "https://photos.google.com/album12345",
            reach: 27058,
            engagement: 154,
          },
        ],
      },
      {
        label: "Statistici",
        value: [
          {
            link: "https://photos.google.com/album123",
            reach: 1000,
            engagement: 89,
          },
          {
            link: "https://photos.google.com/album1234",
            reach: 899,
            engagement: 17,
          },
          {
            link: "https://photos.google.com/album12345",
            reach: 27058,
            engagement: 154,
          },
        ],
      },
      {
        label: "Link Podcast",
        value: [
          {
            link: "https://photos.google.com/album123",
            reach: 1000,
            engagement: 89,
          },
          {
            link: "https://photos.google.com/album1234",
            reach: 899,
            engagement: 17,
          },
          {
            link: "https://photos.google.com/album12345",
            reach: 27058,
            engagement: 154,
          },
        ],
      },
    ],
  },
];
