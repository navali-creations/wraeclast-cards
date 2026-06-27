import { Link } from "@tanstack/react-router";
import { preload } from "react-dom";
import { H2 } from "../../../../components/headings";
import { Text } from "../../../../components/text";
import type { Card } from "../../../cards/types";
import { useRandomCards } from "../../hooks/useRandomCards";
import { StaticDivinationCard } from "./StaticDivinationCard";

const CARD_COUNT = 4;
const SKELETON_KEYS = Array.from(
  { length: CARD_COUNT },
  (_, idx) => `skeleton-card-${idx}`,
);
const CARD_W = 320;
const CARD_H = 476;
const SCALE = 0.55;

function ScaledCard({ card }: { card: Card }) {
  return (
    <Link
      to="/cards"
      search={{ name: undefined, sortBy: undefined, sortDesc: undefined }}
      className="block"
      style={{
        width: CARD_W * SCALE,
        height: CARD_H * SCALE,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          width: CARD_W,
          height: CARD_H,
          pointerEvents: "none",
        }}
      >
        <StaticDivinationCard card={card} />
      </div>
    </Link>
  );
}

export function CardDatabasePanel() {
  const cards = useRandomCards(CARD_COUNT);

  for (const card of cards) {
    if (card.imageUrl) preload(card.imageUrl, { as: "image" });
  }

  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-(--wc-border) bg-base-300 p-5">
      <div className="flex flex-col gap-1">
        <Text
          size="xs"
          weight="semibold"
          uppercase
          className="tracking-wider text-info"
        >
          Card Database
        </Text>
        <H2 size="xl" className="text-(--wc-text-90)">
          451+ divination cards
        </H2>
        <Text size="sm" className="text-(--wc-text-60)">
          Live chaos &amp; divine pricing, drop locations, and full card
          metadata updated each league.
        </Text>
      </div>

      {/* 2×2 card grid */}
      <div className="grid grid-cols-2 gap-3 justify-items-center">
        {cards.length > 0
          ? cards.map((card) => <ScaledCard key={card.id} card={card} />)
          : SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="animate-pulse rounded border border-(--wc-border) bg-base-200"
                style={{ width: CARD_W * SCALE, height: CARD_H * SCALE }}
              />
            ))}
      </div>
    </div>
  );
}
