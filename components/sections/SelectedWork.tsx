import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

export function SelectedWork() {
  return (
    <section className="signal-section" id="work" aria-labelledby="work-heading">
      <div className="signal-shell">
        <FadeIn className="signal-section-heading"><div><p className="signal-label">02 / ИЗБРАННЫЕ РАБОТЫ</p><h2 id="work-heading">Из идеи.<br /><span>В реальность.</span></h2></div><p className="signal-body">Реальные сайты бизнеса.<br />У каждого — свой характер.</p></FadeIn>
        <div className="signal-work-grid">{projects.map((project, index) => <FadeIn key={project.slug} delay={index * 0.08}><ProjectCard project={project} index={index} /></FadeIn>)}</div>
      </div>
    </section>
  );
}
