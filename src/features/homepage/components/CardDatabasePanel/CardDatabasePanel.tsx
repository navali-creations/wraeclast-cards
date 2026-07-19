import { preload } from "react-dom";
import { FiArrowRight } from "react-icons/fi";
import { useLeagueContext } from "../../../../app/league-context";
import { ButtonInternalLink } from "../../../../components/buttons/ButtonLink";
import {
  DIVINATION_CARD_HEIGHT,
  DIVINATION_CARD_WIDTH,
} from "../../../../components/DivinationCard/constants";
import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";
import { useCardsQuery } from "../../../cards/hooks";
import { useRarityPreviewCards } from "../../hooks/useRarityPreviewCards";
import { SCALE, ScaledCard } from "./ScaledCard";

const CARD_COUNT = 4;
const SKELETON_KEYS = Array.from(
  { length: CARD_COUNT },
  (_, idx) => `skeleton-card-${idx}`,
);

export function CardDatabasePanel() {
  const { selectedLeague } = useLeagueContext();
  const { data: allCards, isLoading } = useCardsQuery();
  const cards = useRarityPreviewCards();
  const hasCards = cards.length > 0;
  const cardCount = allCards
    ? Math.max(allCards.length, selectedLeague.card_count)
    : undefined;

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
        <Heading as="h2" size="xl" className="text-(--wc-text-90)">
          {cardCount !== undefined
            ? `${cardCount} divination cards`
            : "Divination cards"}
        </Heading>
        <Text size="sm" className="text-(--wc-text-60)">
          Full card metadata updated each league.
        </Text>
      </div>

      {/* 2×2 card grid */}
      <div className="grid grid-cols-2 gap-3 justify-items-center">
        {hasCards &&
          cards.map((card) => <ScaledCard key={card.id} card={card} />)}

        {!hasCards &&
          isLoading &&
          SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="wc-card-shimmer rounded border border-(--wc-border)"
              style={{
                width: DIVINATION_CARD_WIDTH * SCALE,
                height: DIVINATION_CARD_HEIGHT * SCALE,
              }}
            />
          ))}

        {!hasCards && !isLoading && (
          <Text
            size="sm"
            className="col-span-2 py-8 text-center text-(--wc-text-50)"
          >
            {selectedLeague.historical
              ? "Detailed card previews are unavailable for this archived league."
              : "No card data available for this game yet."}
          </Text>
        )}
      </div>

      <ButtonInternalLink
        gameScoped
        to="/cards"
        className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-(--wc-accent-border) bg-(--wc-glow) px-4 py-2 text-center text-sm font-medium text-(--wc-text-90) transition-colors hover:brightness-110"
      >
        Browse all cards
        <FiArrowRight aria-hidden="true" />
      </ButtonInternalLink>
    </div>
  );
}
