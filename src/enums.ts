export const EGame = {
  Poe1: "poe1",
  Poe2: "poe2",
} as const;

export type EGame = (typeof EGame)[keyof typeof EGame];
