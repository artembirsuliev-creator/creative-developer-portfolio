import { ArrowDownRight } from "lucide-react";

import WarpText from "@/components/effects/WarpText";
import { FadeIn } from "@/components/motion/FadeIn";
import { FuseLink } from "@/components/ui/FuseLink";

export function Hero() {
  return (
    <section className="template-hero relative flex min-h-[calc(100svh-5rem)] items-center justify-center px-5 py-20 text-center sm:px-8 md:px-10">
      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-10">
        <FadeIn>
          <p className="template-kicker">INDEPENDENT CREATIVE DEVELOPER / 2026</p>
        </FadeIn>
        <FadeIn className="w-full max-w-5xl" delay={0.08} y={40}>
          <div aria-level={1} className="w-full text-center" role="heading">
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
              style={{ height: "clamp(280px, 36vw, 430px)" }}
              text={"DIGITAL\nPROJECTS WITH\nCHARACTER."}
              warpScale={1.7}
              warpStrength={0.08}
            />
          </div>
        </FadeIn>
        <FadeIn className="max-w-xl" delay={0.16}>
          <p className="template-copy">Я создаю выразительные цифровые продукты, где арт-дирекшн, motion и разработка работают как единое целое.</p>
        </FadeIn>
        <FadeIn delay={0.24}>
          <FuseLink
            href="#work"
            icon={<ArrowDownRight aria-hidden="true" className="size-4" />}
            label="СМОТРЕТЬ РАБОТЫ"
          />
        </FadeIn>
      </div>
    </section>
  );
}
