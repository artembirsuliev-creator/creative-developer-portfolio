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
    slug: "oracare",
    title: "ORACARE",
    subtitle: "Современный сайт стоматологической клиники с записью на приём.",
    year: "2026",
    role: "Сайт-референс",
    client: "OraCare Dental Clinic",
    description:
      "Визуально насыщенный сайт стоматологической клиники с услугами, врачами, отзывами, блогом и онлайн-записью.",
    thumbnail: "oracare",
    heroMedia: "oracare",
    gallery: [],
    technologies: ["Framer", "Dental", "Motion"],
    services: ["Стоматология", "Косметическая стоматология", "Запись на приём"],
    externalUrl: "https://oracarenew.framer.website/",
    accent: "#d7ff5f",
  },
  {
    slug: "dentique",
    title: "DENTIQUE",
    subtitle: "Премиальный шаблон Framer для стоматологических клиник.",
    year: "2026",
    role: "Шаблон Framer",
    client: "Framer Marketplace",
    description:
      "Редакционный шаблон для стоматологий, ортодонтов и частных практик с treatment pages, CMS, формами записи и адаптивной версией.",
    thumbnail: "dentique",
    heroMedia: "dentique",
    gallery: [],
    technologies: ["Framer", "CMS", "Responsive UI"],
    services: ["Стоматология", "Ортодонтия", "Частная практика"],
    externalUrl: "https://www.framer.com/marketplace/templates/dentique/",
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
