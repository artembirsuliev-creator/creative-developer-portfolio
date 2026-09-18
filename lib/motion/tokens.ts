export const motionTokens = {
  duration: {
    fast: 0.2,
    normal: 0.45,
    reveal: 0.8,
  },
  ease: {
    standard: [0.22, 1, 0.36, 1] as const,
    entrance: [0.16, 1, 0.3, 1] as const,
    exit: [0.7, 0, 0.84, 0] as const,
  },
  stagger: {
    tight: 0.04,
    relaxed: 0.08,
  },
} as const;
