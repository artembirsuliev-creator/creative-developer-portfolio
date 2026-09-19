import { ArrowUpRight } from "lucide-react";

import { FadeIn } from "@/components/motion/FadeIn";
import WarpText from "@/components/effects/WarpText";
import { FuseLink } from "@/components/ui/FuseLink";
import { siteConfig } from "@/data/site";

export function Contact() {
  return (
    <section className="template-section pb-24" id="contact">
      <div className="container-shell">
        <FadeIn className="border-t border-border pt-8">
          <p className="template-kicker mb-12 text-center">Есть идея?</p>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div aria-level={2} className="w-full max-w-4xl text-center" role="heading">
              <WarpText
                color="#bbccd7"
                fontFamily="var(--font-kanit), sans-serif"
                fontSize="clamp(3rem, 10vw, 9rem)"
                fontWeight={800}
                letterSpacing="-0.06em"
                lineHeight={0.9}
                pointerInfluence={0.42}
                pointerStrength={0.38}
                refraction={0.018}
                ripple
                speed={0.55}
                style={{ height: "clamp(360px, 42vw, 500px)" }}
                text={"Давайте\nсоздадим\nто, что\nзапомнится."}
                warpScale={1.7}
                warpStrength={0.08}
              />
            </div>
            <FuseLink
              ariaLabel={`Написать в Telegram ${siteConfig.telegram}`}
              className="shrink-0"
              href={siteConfig.telegramUrl}
              icon={<ArrowUpRight aria-hidden="true" className="size-5" />}
              label={siteConfig.telegramLabel}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
