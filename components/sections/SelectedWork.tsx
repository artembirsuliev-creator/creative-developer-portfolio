import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger } from "@/components/motion/Stagger";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { FuseLink } from "@/components/ui/FuseLink";
import { projects } from "@/data/projects";

export function SelectedWork() {
  return (
    <section className="template-section" id="work">
      <div className="container-shell">
        <FadeIn className="mb-12 text-center">
          <div>
            <p className="template-kicker mb-5">Реальные сайты бизнеса</p>
            <h2 className="hero-heading text-4xl font-black uppercase tracking-tight sm:text-7xl">Смотрите примеры.</h2>
          </div>
        </FadeIn>
        <Stagger className="template-work-grid grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard index={index} key={project.slug} project={project} />
          ))}
        </Stagger>
        <FadeIn className="mt-12 text-center" delay={0.18}>
          <FuseLink href="#contact" label="Обсудить проект" />
        </FadeIn>
      </div>
    </section>
  );
}
