import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/data/projects";

const projectVisuals: Record<string, string> = {
  oracare: "project-visual project-visual-lime",
  dentique: "project-visual project-visual-lilac",
  aniflow: "project-visual project-visual-orange",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const content = (
    <>
      <div className={`${projectVisuals[project.slug] ?? "project-visual"} relative aspect-[1.2] overflow-hidden`}>
        <div aria-hidden="true" className="project-visual-shape" />
        <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">0{index + 1}</span>
        <span className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">{project.role}</span>
        <span className="absolute bottom-5 right-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/70">{project.year}</span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-5">
        <div>
          <h3 className="text-2xl font-medium tracking-[-0.04em] text-foreground transition-colors group-hover:text-accent sm:text-3xl">{project.title}</h3>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{project.subtitle}</p>
        </div>
        <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent" />
      </div>
    </>
  );

  return (
    <article className="group">
      {project.externalUrl ? (
        <a
          aria-label={`Открыть ${project.title}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          href={project.externalUrl}
          rel="noreferrer"
          target="_blank"
        >
          {content}
        </a>
      ) : (
        <Link className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" href={`/work/${project.slug}`}>
          {content}
        </Link>
      )}
    </article>
  );
}
