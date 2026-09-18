"use client";

import { motion, useReducedMotion } from "motion/react";

import { wordRevealVariants } from "@/lib/motion/variants";

type RevealTextProps = {
  text: string;
  className?: string;
};

export function RevealText({ text, className }: RevealTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <span aria-label={text} className={className}>
      {words.map((word, index) => (
        <span className="inline-block overflow-hidden align-top" key={`${word}-${index}`}>
          <motion.span
            aria-hidden="true"
            className="inline-block"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: index * 0.045 }}
            variants={wordRevealVariants}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </span>
  );
}
