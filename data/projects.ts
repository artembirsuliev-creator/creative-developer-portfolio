export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  client: string;
  description: string;
  thumbnail: string;
  heroMedia: string;
  gallery: string[];
  technologies: string[];
  services: string[];
  externalUrl?: string;
  links?: { label: string; href: string }[];
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "zdental",
    title: "Z-DENTAL",
    subtitle: "Современная стоматология с услугами, ценами и записью на приём.",
    year: "2026",
    role: "Vibe-coding",
    client: "Z-Dental",
    description:
      "Сайт стоматологической клиники с услугами, ценами, преимуществами лечения и формой записи на консультацию.",
    thumbnail: "zdental",
    heroMedia: "zdental",
    gallery: [],
    technologies: ["Healthcare", "Conversion", "Booking"],
    services: ["Стоматология", "Косметическая стоматология", "Запись на приём"],
    externalUrl: "https://z-dental.ru/",
    accent: "#d7ff5f",
  },
  {
    slug: "lume21",
    title: "LUME21",
    subtitle: "Пространство эстетики и клинической экспертизы с онлайн-записью.",
    year: "2026",
    role: "Vibe-coding",
    client: "LUME21",
    description:
      "Премиальный сайт бьюти-пространства, объединяющий стиль, косметологию, медицинскую экспертизу и запись на услуги.",
    thumbnail: "lume21",
    heroMedia: "lume21",
    gallery: [],
    technologies: ["Beauty", "Editorial UI", "Booking"],
    services: ["Косметология", "Уход", "Онлайн-запись"],
    externalUrl: "https://lume21.ru/",
    accent: "#d8a7ff",
  },
  {
    slug: "aniflow",
    title: "ANIFLOW AI",
    subtitle: "Креативная AI-студия для создания аниме-сцен и визуалов.",
    year: "2026",
    role: "Vibe-coding",
    client: "AniFlow AI",
    description:
      "Креативный AI-продукт с prompt-first workflow, генерацией изображений, image-to-image режимом, референсами и набором стилевых пресетов.",
    thumbnail: "aniflow",
    heroMedia: "aniflow",
    gallery: [],
    technologies: ["AI", "Image generation", "Creative tool"],
    services: ["Prompt workflow", "Reference-guided iteration", "Visual generation"],
    externalUrl: "https://animify.app/",
    accent: "#ff9d7a",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
