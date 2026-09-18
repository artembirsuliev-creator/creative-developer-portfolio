import { FadeIn } from "@/components/motion/FadeIn";

const services = [
  { title: "Арт-дирекшн", text: "Визуальный язык, нарратив и принципы взаимодействия, которые задают работе характер." },
  { title: "Дизайн", text: "Интерфейсы и motion-системы, которые делают сложные идеи понятными с первого взгляда." },
  { title: "Разработка", text: "Быстрые и надёжные React-продукты, которые сохраняют выразительность по мере роста." },
];

export function Services() {
  return (
    <section className="template-section" id="services">
      <div className="container-shell grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
        <FadeIn>
          <p className="template-kicker text-center">Услуги</p>
        </FadeIn>
        <div className="template-services divide-y">
          {services.map((service, index) => (
            <FadeIn className="grid gap-5 py-7 sm:grid-cols-[0.25fr_0.75fr]" delay={index * 0.06} key={service.title}>
              <span className="template-kicker">0{index + 1}</span>
              <div className="grid gap-3 sm:grid-cols-[0.45fr_0.55fr] sm:gap-8">
                <h3 className="text-2xl font-semibold uppercase tracking-tight text-white">{service.title}</h3>
                <p className="max-w-md text-sm leading-6 text-white/60">{service.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
