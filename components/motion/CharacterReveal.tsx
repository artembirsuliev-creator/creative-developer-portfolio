"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type CharacterProps = {
  character: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
};

function Character({ character, index, total, progress, reduceMotion }: CharacterProps) {
  const charProgress = index / total;
  const start = Math.max(0, charProgress - 0.1);
  const end = Math.min(1, charProgress + 0.05);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block" aria-hidden="true">
      <span className="invisible">{character === " " ? "\u00a0" : character}</span>
      <motion.span className="absolute inset-0" style={{ opacity: reduceMotion ? 1 : opacity }}>
        {character === " " ? "\u00a0" : character}
      </motion.span>
    </span>
  );
}

type CharacterRevealProps = {
  text: string;
  className?: string;
};

export function CharacterReveal({ text, className }: CharacterRevealProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const reduceMotion = useReducedMotion() ?? false;
  const characters = Array.from(text);

  return (
    <p aria-label={text} className={className} ref={containerRef}>
      {characters.map((character, index) => (
        <Character
          character={character}
          index={index}
          key={`${character}-${index}`}
          progress={scrollYProgress}
          reduceMotion={reduceMotion}
          total={characters.length}
        />
      ))}
    </p>
  );
}
