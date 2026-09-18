"use client";

import { motion, useReducedMotion } from "motion/react";

const cornerImages = [
  {
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
    className: "top-[4%] left-[1%] w-[120px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]",
    x: -80,
    delay: 0.1,
  },
  {
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
    className: "bottom-[8%] left-[3%] w-[100px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]",
    x: -80,
    delay: 0.25,
  },
  {
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
    className: "top-[4%] right-[1%] w-[120px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]",
    x: 80,
    delay: 0.15,
  },
  {
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
    className: "bottom-[8%] right-[3%] w-[130px] sm:right-[6%] sm:w-[170px] md:right-[10%] md:w-[220px]",
    x: 80,
    delay: 0.3,
  },
] as const;

export function AboutCorners() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {cornerImages.map((image) => (
        <motion.img
          alt=""
          className={`absolute h-auto ${image.className}`}
          initial={shouldReduceMotion ? false : { opacity: 0, x: image.x, y: 0 }}
          key={image.src}
          loading="lazy"
          src={image.src}
          transition={{ delay: image.delay, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "50px", amount: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
        />
      ))}
    </div>
  );
}
