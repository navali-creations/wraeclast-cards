import type { CSSProperties } from "react";
import {
  DIVINATION_CARD_HEIGHT,
  DIVINATION_CARD_WIDTH,
} from "../../../../../components/DivinationCard/constants";
import type { Card } from "../../../../cards/types";

const EDGE_GAP = 8;
const PREVIEW_GAP = 12;
const DESKTOP_SCALE = 0.7;
const MOBILE_SCALE = 0.5;
const MOBILE_BREAKPOINT = 640;
const cardNameIndexes = new WeakMap<readonly Card[], Map<string, Card>>();

interface ViewportSize {
  width: number;
  height: number;
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function getCardNameKey(name: string) {
  return name.normalize("NFKC").trim().toLocaleLowerCase("en-US");
}

export function findCardByName(cards: readonly Card[], name: string) {
  let index = cardNameIndexes.get(cards);
  if (!index) {
    index = new Map(cards.map((card) => [getCardNameKey(card.name), card]));
    cardNameIndexes.set(cards, index);
  }

  return index.get(getCardNameKey(name)) ?? null;
}

export function getCardNamePreviewStyle(
  triggerRect: DOMRect,
  viewport: ViewportSize,
): CSSProperties {
  const isMobile = viewport.width < MOBILE_BREAKPOINT;
  const scale = isMobile ? MOBILE_SCALE : DESKTOP_SCALE;
  const renderedWidth = DIVINATION_CARD_WIDTH * scale;
  const renderedHeight = DIVINATION_CARD_HEIGHT * scale;

  if (isMobile) {
    const top = clamp(
      triggerRect.top - renderedHeight - PREVIEW_GAP,
      EDGE_GAP,
      viewport.height - renderedHeight - EDGE_GAP,
    );
    const left = clamp(
      triggerRect.left + triggerRect.width / 2 - renderedWidth / 2,
      EDGE_GAP,
      viewport.width - renderedWidth - EDGE_GAP,
    );

    return {
      top,
      left,
      width: DIVINATION_CARD_WIDTH,
      height: DIVINATION_CARD_HEIGHT,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
    };
  }

  const preferredLeft = triggerRect.right + PREVIEW_GAP;
  const fallbackLeft = triggerRect.left - renderedWidth - PREVIEW_GAP;
  const left =
    preferredLeft + renderedWidth + EDGE_GAP <= viewport.width
      ? preferredLeft
      : fallbackLeft;

  return {
    top: clamp(
      triggerRect.top + triggerRect.height / 2 - renderedHeight / 2,
      EDGE_GAP,
      viewport.height - renderedHeight - EDGE_GAP,
    ),
    left: clamp(left, EDGE_GAP, viewport.width - renderedWidth - EDGE_GAP),
    width: DIVINATION_CARD_WIDTH,
    height: DIVINATION_CARD_HEIGHT,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };
}
