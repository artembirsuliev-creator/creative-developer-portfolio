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
    slug: "mn-renovation",
    title: "МН РЕМОНТ",
    subtitle: "Сайт ремонтной команды для квартир, домов и коммерческих помещений.",
    year: "2026",
    role: "Vibe-coding",
    client: "МН",
    description:
      "Сайт команды по ремонту и комплексной отделке помещений в Самаре и Тольятти. Проекты показывают ход работ, этапы и внимание к деталям.",
    thumbnail: "mn-renovation",
    heroMedia: "mn-renovation",
    gallery: [],
    technologies: ["Сайт-портфолио", "Галерея проектов", "Онлайн-обращения"],
    services: ["Ремонт квартир", "Дома и коттеджи", "Коммерческие помещения"],
    externalUrl: "https://lending22.vercel.app/#projects",
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
