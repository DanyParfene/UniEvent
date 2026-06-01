import type { EventDto, MetricCategory } from '../../api/api-types';

export type SocialMediaLink = {
  link: string;
  reach: number;
  engagement: number;
};

// Am adăugat string[] aici ca să suporte array-ul de "Invitați" cerut de formular
export type Field = { label: string; value: string | number | string[] | SocialMediaLink[] };

export const bannerLabel = "Afiș eveniment";

export type Section = {
  sectionTitle: string;
  fields: Field[];
};

export const eventData: Section[] = [
  {
    sectionTitle: "Date generale",
    fields: [
      { label: "Denumire eveniment", value: "Conferința Tech 2026" },
      { label: bannerLabel, value: "https://drive.google.com/file/d/1Og0Z_OVBbmOvgn8WS5ZwmxIaP3pqOWIt/view?usp=sharing" },
      { label: "Dată eveniment", value: "2026-05-15" }, // Formatat YYYY-MM-DD pentru validarea Zod
      { label: "Dată final eveniment", value: "2026-05-16" }, // Adăugat pentru validarea Zod finishEventDate
      { label: "Ediție", value: 10 }, // Număr pentru validarea Zod
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
      { label: "Invitați", value: ["Andrei Terbea", "Maria Popescu"] }, // Transformat în Array pentru z.array(z.string())
      { label: "Mod organizare", value: "hybrid" }, // Enum Zod: physical | hybrid | online
    ],
  },
  {
    sectionTitle: "Participare",
    fields: [
      { label: "Număr estimat participanți", value: 450 },
      { label: "Grup țintă", value: "Studenți, Profesori, Parteneri IT" },
      { label: "Livestream", value: "YES" }, // Enum Zod: YES | NO
    ],
  },
  {
    sectionTitle: "Contact",
    fields: [
      { label: "Coordonator", value: "Popescu Ion" },
      { label: "Email", value: "ion.popescu12@e-uvt.ro" }, // Adaptat pentru regex-ul tău de e-uvt.ro (are nevoie de 2 cifre înainte de @)
      { label: "Telefon", value: "+40722123456" }, // Adaptat pentru regex-ul tău (+40 și cifre)
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
          { link: "https://photos.google.com/album123", reach: 1000, engagement: 89 },
          { link: "https://photos.google.com/album1234", reach: 899, engagement: 17 },
          { link: "https://photos.google.com/album12345", reach: 27058, engagement: 154 },
        ],
      },
      {
        label: "Facebook UVT",
        value: [
          { link: "https://photos.google.com/album123", reach: 1000, engagement: 89 },
          { link: "https://photos.google.com/album1234", reach: 899, engagement: 17 },
          { link: "https://photos.google.com/album12345", reach: 27058, engagement: 154 },
        ],
      },
      {
        label: "Instagram",
        value: [
          { link: "https://photos.google.com/album123", reach: 1000, engagement: 89 },
          { link: "https://photos.google.com/album1234", reach: 899, engagement: 17 },
          { link: "https://photos.google.com/album12345", reach: 27058, engagement: 154 },
        ],
      },
      {
        label: "TikTok",
        value: [
          { link: "https://photos.google.com/album123", reach: 1000, engagement: 89 },
          { link: "https://photos.google.com/album1234", reach: 899, engagement: 17 },
          { link: "https://photos.google.com/album12345", reach: 27058, engagement: 154 },
        ],
      },
      {
        label: "Comunicat de presă",
        value: [
          { link: "https://photos.google.com/album123", reach: 1000, engagement: 89 },
          { link: "https://photos.google.com/album1234", reach: 899, engagement: 17 },
          { link: "https://photos.google.com/album12345", reach: 27058, engagement: 154 },
        ],
      },
      {
        label: "Apariții în presă",
        value: [
          { link: "https://photos.google.com/album123", reach: 1000, engagement: 89 },
          { link: "https://photos.google.com/album1234", reach: 899, engagement: 17 },
          { link: "https://photos.google.com/album12345", reach: 27058, engagement: 154 },
        ],
      },
      {
        label: "Statistici",
        value: [
          { link: "https://photos.google.com/album123", reach: 1000, engagement: 89 },
          { link: "https://photos.google.com/album1234", reach: 899, engagement: 17 },
          { link: "https://photos.google.com/album12345", reach: 27058, engagement: 154 },
        ],
      },
      {
        label: "Link Podcast",
        value: [
          { link: "https://photos.google.com/album123", reach: 1000, engagement: 89 },
          { link: "https://photos.google.com/album1234", reach: 899, engagement: 17 },
          { link: "https://photos.google.com/album12345", reach: 27058, engagement: 154 },
        ],
      },
    ],
  },
];

export const categoryKeyToLabel: Record<MetricCategory, string> = {
  album_foto: 'Album foto',
  facebook: 'Facebook UVT',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  comunicat_presa: 'Comunicat de presă',
  aparitii_presa: 'Apariții în presă',
  statistici: 'Statistici',
  podcast: 'Link Podcast',
};

export const categoryLabelToKey: Record<string, MetricCategory> = Object.fromEntries(
  Object.entries(categoryKeyToLabel).map(([k, v]) => [v, k as MetricCategory]),
);

export function eventDtoToSections(dto: EventDto): Section[] {
  const socialMediaFields: Field[] = dto.metrics.map((m) => ({
    label: categoryKeyToLabel[m.category] ?? m.category,
    value: [{ link: m.link, reach: m.reach, engagement: m.engagement }],
  }));

  const allSocialLabels = Object.values(categoryKeyToLabel);
  const presentLabels = new Set(socialMediaFields.map((f) => f.label));
  for (const label of allSocialLabels) {
    if (!presentLabels.has(label)) {
      socialMediaFields.push({ label, value: [] });
    }
  }
  socialMediaFields.sort(
    (a, b) => allSocialLabels.indexOf(a.label) - allSocialLabels.indexOf(b.label),
  );

  const partnerNames = dto.partners.map((p) => p.name).join(', ');

  return [
    {
      sectionTitle: 'Date generale',
      fields: [
        { label: 'Denumire eveniment', value: dto.eventName },
        { label: bannerLabel, value: dto.banner ?? '' },
        { label: 'Dată eveniment', value: dto.startEventDate },
        { label: 'Dată final eveniment', value: dto.finishEventDate },
        { label: 'Ediție', value: dto.edition },
        { label: 'Organizator', value: dto.organizer },
      ],
    },
    {
      sectionTitle: 'Detalii',
      fields: [
        { label: 'Descriere', value: dto.description },
        { label: 'Locație', value: dto.location },
        { label: 'Invitați', value: dto.invitations },
        { label: 'Mod organizare', value: dto.organizationMode },
      ],
    },
    {
      sectionTitle: 'Participare',
      fields: [
        { label: 'Număr estimat participanți', value: dto.numberOfParticipants },
        { label: 'Grup țintă', value: dto.targetGroup },
        { label: 'Livestream', value: dto.livestream },
      ],
    },
    {
      sectionTitle: 'Contact',
      fields: [
        { label: 'Coordonator', value: dto.coordinator },
        { label: 'Email', value: dto.email },
        { label: 'Telefon', value: dto.telephone },
      ],
    },
    {
      sectionTitle: 'Parteneri eveniment',
      fields: [{ label: 'Parteneri', value: partnerNames }],
    },
    {
      sectionTitle: 'Alte informații',
      fields: [{ label: 'Informații suplimentare', value: dto.otherInformation ?? '' }],
    },
    { sectionTitle: 'Social Media', fields: socialMediaFields },
  ];
}

export const eventDataToFormValues = (data: Section[], defaultBaseValues: any = {}) => {
  const formValues: Record<string, any> = { ...defaultBaseValues };
  
  // Mapăm etichetele românești din UI cu cheile schemei Zod
  const labelToKeyMap: Record<string, string> = {
    "Denumire eveniment": "eventName",
    [bannerLabel]: "banner",
    "Dată eveniment": "startEventDate",
    "Dată final eveniment": "finishEventDate",
    "Ediție": "edition",
    "Organizator": "organizer",
    "Descriere": "description",
    "Locație": "location",
    "Invitați": "invitations",
    "Mod organizare": "organizationMode",
    "Număr estimat participanți": "numberOfParticipants",
    "Grup țintă": "targetGroup",
    "Livestream": "livestream",
    "Coordonator": "coordinator",
    "Email": "email",
    "Telefon": "telephone",
    "Informații suplimentare": "otherInformation",
  };
  
  data.forEach((section) => {
    section.fields.forEach((field) => {
      const formKey = labelToKeyMap[field.label];
      if (formKey) {
        formValues[formKey] = field.value;
      }
    });
  });
  
  return formValues;
};

export const formValuesToEventData = (
  formValues: Record<string, any>,
  originalData: Section[]
): Section[] => {

  const keyToLabelMap: Record<string, string> = {
    eventName: "Denumire eveniment",
    banner: bannerLabel,
    startEventDate: "Dată eveniment",
    finishEventDate: "Dată final eveniment",
    edition: "Ediție",
    organizer: "Organizator",
    description: "Descriere",
    location: "Locație",
    invitations: "Invitați",
    organizationMode: "Mod organizare",
    numberOfParticipants: "Număr estimat participanți",
    targetGroup: "Grup țintă",
    livestream: "Livestream",
    coordinator: "Coordonator",
    email: "Email",
    telephone: "Telefon",
    otherInformation: "Informații suplimentare",
  };

  return originalData.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      const formKey = Object.keys(keyToLabelMap).find(
        (key) => keyToLabelMap[key] === field.label
      );

      return {
        ...field,
        value: formKey && formValues[formKey] !== undefined ? formValues[formKey] : field.value,
      };
    }),
  }));
};