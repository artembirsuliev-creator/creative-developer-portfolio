import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const content = <><div className={`signal-project-visual signal-project-${project.slug}`} aria-hidden="true"><div className="signal-project-browser"><span>● ● ●</span><span>{project.title} / DIGITAL EXPERIENCE</span></div><div className="signal-project-demo"><p>{project.client}</p><strong>{project.slug === "mn-renovation" ? <>Пространство<br />для жизни.</> : project.slug === "lume21" ? <>Искусство<br />быть собой.</> : <>Imagine.<br />Create. Repeat.</>}</strong><span className="signal-project-orb" /><small>{project.services[0]} ↗</small></div><span className="signal-project-index">0{index + 1} / {project.year}</span></div><div className="signal-project-info"><div><h3>{project.title}</h3><p>{project.subtitle}</p></div><ArrowUpRight aria-hidden="true" size={22} /></div><div className="signal-project-tags">{project.technologies.map(tag => <span key={tag}>{tag}</span>)}</div></>;
  return <article className="signal-project">{project.externalUrl ? <a href={project.externalUrl} target="_blank" rel="noreferrer" aria-label={`Открыть ${project.title}`}>{content}</a> : <Link href={`/work/${project.slug}`}>{content}</Link>}</article>;
}
