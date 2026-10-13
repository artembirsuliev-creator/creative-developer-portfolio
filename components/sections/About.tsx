import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { siteConfig } from "@/data/site";

export function About() {
  return (
    <section className="signal-section signal-about" id="about" aria-labelledby="about-heading">
      <div className="signal-shell signal-about-grid">
        <FadeIn>
          <p className="signal-label">01 / ОБО МНЕ</p>
          <h2 id="about-heading">Создаю сайты,<br />которые хочется<br /><span>рассматривать.</span></h2>
          <p className="signal-body">Мне нравится превращать сложные идеи в понятные цифровые формы. Я соединяю дизайн, motion и frontend-разработку, чтобы сайты выглядели выразительно, быстро работали и помогали бизнесу говорить со своей аудиторией.</p>
          <a className="signal-pill" href={siteConfig.telegramUrl} target="_blank" rel="noreferrer">Давай знакомиться <ArrowUpRight size={16} aria-hidden="true" /></a>
        </FadeIn>
        <FadeIn className="signal-art" delay={0.12}>
          <div className="signal-art-top"><span>LOOP / FORM</span><span>DESIGN EXPLORATION</span></div>
          <div className="signal-art-sculpture" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <span key={i} style={{ "--slice": i } as React.CSSProperties} />)}</div>
          <p>Идея обретает форму<span>✦</span></p>
        </FadeIn>
        <FadeIn className="signal-principles"><div><strong>Дизайн</strong><span>Со своим характером</span></div><div><strong>Motion</strong><span>Движение со смыслом</span></div><div><strong>Frontend</strong><span>Внимание к деталям</span></div></FadeIn>
      </div>
    </section>
  );
}
