import { AboutCorners } from "@/components/effects/AboutCorners";
import WarpText from "@/components/effects/WarpText";
import { FadeIn } from "@/components/motion/FadeIn";
import { CharacterReveal } from "@/components/motion/CharacterReveal";
import { FuseLink } from "@/components/ui/FuseLink";

export function About() {
  return (
    <section className="about-template relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10" id="about">
      <AboutCorners />
      <div className="relative z-10 flex max-w-4xl flex-col items-center justify-center gap-16 text-center sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn className="w-full" delay={0} duration={0.7} y={40}>
            <div aria-level={2} className="w-full text-center" role="heading">
              <WarpText
                color="#bbccd7"
                fontFamily="var(--font-kanit), sans-serif"
                fontSize="clamp(4rem, 12vw, 10rem)"
                fontWeight={800}
                letterSpacing="-0.06em"
                lineHeight={0.86}
                pointerInfluence={0.42}
                pointerStrength={0.38}
                refraction={0.018}
                ripple
                speed={0.55}
                style={{ height: "clamp(250px, 30vw, 380px)" }}
                text="ОБО МНЕ"
                warpScale={1.7}
                warpStrength={0.08}
              />
            </div>
          </FadeIn>
          <CharacterReveal
            className="about-copy max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed"
            text="Мне нравится превращать сложные идеи в понятные цифровые формы. Я соединяю дизайн, motion и frontend-разработку, чтобы сайты выглядели выразительно, быстро работали и помогали бизнесу говорить со своей аудиторией."
          />
        </div>
        <FadeIn delay={0.3} duration={0.7} y={20}>
          <FuseLink
            href="#contact"
            label="Связаться со мной"
          />
        </FadeIn>
      </div>
    </section>
  );
}
