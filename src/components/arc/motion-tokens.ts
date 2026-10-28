export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.16,
    standard: 0.24,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1],
    standard: [0.22, 1, 0.36, 1],
  },
  spring: {
    /** Presses, toggles, thumbs, and small indicators. Settles fast and never overshoots, so nothing jitters. */
    snappy: { type: "spring", visualDuration: 0.26, bounce: 0 },
    /** Panels, height changes, and layout shifts. Critically damped, never overshoots. */
    smooth: { type: "spring", visualDuration: 0.4, bounce: 0 },
  },
  blur: { subtle: 2 },
} as const;
