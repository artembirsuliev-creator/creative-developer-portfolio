"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

import { staggerContainerVariants } from "@/lib/motion/variants";

export function Stagger({ children, ...props }: HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainerVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
