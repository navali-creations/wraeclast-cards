import type { CSSProperties } from "react";
import type { CardRarity } from "../../../types";

export const CARD_RARITY_LABELS: Record<CardRarity, string> = {
  0: "Unknown",
  1: "Extremely rare",
  2: "Rare",
  3: "Less common",
  4: "Common",
};

export const CARD_RARITY_BADGE_STYLES: Record<CardRarity, CSSProperties> = {
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
