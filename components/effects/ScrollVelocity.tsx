"use client";

import {
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  motion,
  useReducedMotion,
} from "motion/react";
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";

type VelocityMapping = {
  input: number[];
  output: number[];
};

type ScrollVelocityProps = {
  scrollContainerRef?: RefObject<HTMLElement | null>;
  texts?: ReactNode[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: CSSProperties;
  scrollerStyle?: CSSProperties;
};

function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

type VelocityTextProps = {
  children: ReactNode;
  baseVelocity: number;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  className: string;
  damping: number;
  stiffness: number;
  numCopies: number;
  velocityMapping: VelocityMapping;
  parallaxClassName: string;
  scrollerClassName: string;
  parallaxStyle?: CSSProperties;
  scrollerStyle?: CSSProperties;
};

function VelocityText({
  children,
  baseVelocity,
  scrollContainerRef,
  className,
  damping,
  stiffness,
  numCopies,
  velocityMapping,
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}: VelocityTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : undefined;
  const { scrollY } = useScroll(scrollOptions);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false },
  );
  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);
  const directionFactor = useRef(1);

  const x = useTransform(baseX, (value) => {
    if (copyWidth === 0) return "0px";
    const range = copyWidth;
    const wrapped = (((value % range) + range) % range) - range;
    return `${wrapped}px`;
  });

  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();

    if (factor < 0) directionFactor.current = -1;
    if (factor > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={parallaxClassName} style={parallaxStyle}>
      <motion.div className={scrollerClassName} style={{ x, ...scrollerStyle }}>
        {Array.from({ length: numCopies }, (_, index) => (
          <span
            aria-hidden={index > 0}
            className={className}
            key={index}
            ref={index === 0 ? copyRef : undefined}
          >
            {children}&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ScrollVelocity({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
}: ScrollVelocityProps) {
  const safeCopies = Math.min(Math.max(Math.round(numCopies), 2), 10);

  return (
    <div className="scroll-velocity" aria-label="Давайте создадим то, что запомнится">
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          className={className}
          damping={damping}
          numCopies={safeCopies}
          parallaxClassName={parallaxClassName}
          parallaxStyle={parallaxStyle}
          scrollContainerRef={scrollContainerRef}
          scrollerClassName={scrollerClassName}
          scrollerStyle={scrollerStyle}
          stiffness={stiffness}
          velocityMapping={velocityMapping}
        >
          {text}
        </VelocityText>
      ))}
    </div>
  );
}
