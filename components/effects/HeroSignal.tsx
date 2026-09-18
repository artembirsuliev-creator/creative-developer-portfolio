"use client";

import { motion, useReducedMotion } from "motion/react";

import { motionTokens } from "@/lib/motion/tokens";

export function HeroSignal() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="hero-signal relative aspect-square w-full max-w-[34rem] overflow-hidden border border-border bg-surface">
      <div aria-hidden="true" className="absolute inset-0 signal-grid" />
      <motion.div
        aria-hidden="true"
        className="signal-orbit signal-orbit-one"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden="true"
        className="signal-orbit signal-orbit-two"
        animate={shouldReduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden="true"
        className="signal-core"
        initial={shouldReduceMotion ? false : { scale: 0.75, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: motionTokens.duration.reveal, delay: 0.5, ease: motionTokens.ease.entrance }}
      >
        <span className="signal-core-mark">+</span>
      </motion.div>
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Signal / 01</span>
        <span>Live system</span>
      </div>
    </div>
  );
}
