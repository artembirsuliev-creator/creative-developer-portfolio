import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { siteConfig } from "@/data/site";

export function Contact() {
  return (
    <section className="signal-contact" id="contact" aria-labelledby="contact-heading">
      <div className="signal-marquee" aria-hidden="true"><div>{Array.from({ length: 4 }, (_, i) => <span key={i}>WEB ✦ LANDING ✦ DESIGN ✦ </span>)}</div></div>
      <div className="signal-shell">
        <FadeIn><p className="signal-label">06 / КОНТАКТЫ</p><h2 id="contact-heading">Давай сделаем<br />твой сайт<span className="signal-dot">.</span></h2></FadeIn>
        <FadeIn className="signal-contact-grid" delay={0.1}>
          <p className="signal-body">Есть идея? Расскажи о ней.<br />Вместе найдём её цифровую форму.</p>
          <a className="signal-contact-link" href={siteConfig.telegramUrl} target="_blank" rel="noreferrer"><span className="signal-label">НАПИСАТЬ В TELEGRAM</span><strong>{siteConfig.telegram}<ArrowUpRight aria-hidden="true" size={24} /></strong><span className="signal-pill">Обсудить проект <ArrowUpRight aria-hidden="true" size={15} /></span></a>
        </FadeIn>
      </div>
    </section>
  );
}
