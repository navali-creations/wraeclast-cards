import type { CSSProperties } from "react";
import type { DivinationCardRarity } from "../../../../../lib/divinationCards";

export const CARD_RARITY_BADGE_STYLES: Record<
  DivinationCardRarity,
  CSSProperties
> = {
  0: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    color: "rgba(245, 158, 11, 0.85)",
    borderColor: "rgba(245, 158, 11, 0.4)",
    borderWidth: 1,
    borderStyle: "solid",
  },
  1: {
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(0, 0, 255)",
    borderColor: "rgb(255, 255, 255)",
    borderWidth: 1,
    borderStyle: "solid",
  },
  2: {
    backgroundColor: "rgb(0, 20, 180)",
    color: "rgb(255, 255, 255)",
    borderColor: "rgb(255, 255, 255)",
    borderWidth: 1,
    borderStyle: "solid",
  },
  3: {
    backgroundColor: "rgb(0, 220, 240)",
    color: "rgb(0, 0, 0)",
    borderColor: "rgb(0, 220, 240)",
    borderWidth: 1,
    borderStyle: "solid",
  },
  4: {
    backgroundColor: "rgba(160, 160, 170, 0.1)",
    color: "rgba(200, 200, 210, 0.6)",
    borderColor: "rgba(160, 160, 170, 0.2)",
    borderWidth: 1,
    borderStyle: "solid",
  },
};
