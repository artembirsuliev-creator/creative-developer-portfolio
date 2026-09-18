import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { FadeIn } from "@/components/motion/FadeIn";
import { getProject, projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  return {
    title: project ? `${project.title} — Проект` : "Проект не найден",
    description: project?.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return null;
  }

  return (
    <main className="container-shell relative z-10 py-14 sm:py-20">
      <FadeIn>
        <Link className="link-arrow mb-16" href="/#work">
          <ArrowLeft aria-hidden="true" className="size-4" /> Назад к проектам
        </Link>
      </FadeIn>
      <div className="grid gap-14 lg:grid-cols-[0.7fr_0.3fr] lg:gap-20">
        <div>
          <FadeIn>
            <p className="eyebrow mb-7 text-accent">{project.year} / {project.role}</p>
            <h1 className="display max-w-4xl text-[clamp(4rem,11vw,10rem)] font-medium leading-[0.84] tracking-[-0.09em] text-foreground">{project.title}</h1>
            <p className="mt-10 max-w-xl text-xl leading-8 text-muted-foreground sm:text-2xl">{project.subtitle}</p>
          </FadeIn>
          <FadeIn className={`project-detail-visual project-detail-${project.thumbnail} mt-16`} delay={0.1}>
            <div aria-hidden="true" className="project-detail-shape" />
          </FadeIn>
        </div>
        <FadeIn className="lg:pt-16" delay={0.15}>
          <div className="border-t border-border pt-5">
            <dl className="space-y-7 text-sm">
              <div><dt className="mb-2 text-muted-foreground">Клиент</dt><dd>{project.client}</dd></div>
              <div><dt className="mb-2 text-muted-foreground">Услуги</dt><dd>{project.services.join(" / ")}</dd></div>
              <div><dt className="mb-2 text-muted-foreground">Технологии</dt><dd>{project.technologies.join(" / ")}</dd></div>
            </dl>
          </div>
          <p className="mt-16 text-base leading-7 text-muted-foreground">{project.description}</p>
          {project.links?.map((link) => <a className="link-arrow mt-8" href={link.href} key={link.href}>{link.label} <ArrowUpRight aria-hidden="true" className="size-4" /></a>)}
        </FadeIn>
      </div>
    </main>
  );
}
