import { useGameContext } from "../../../app/game-context";
import { ButtonInternalLink } from "../../../components/buttons/ButtonLink";
import { Heading } from "../../../components/headings";
import { Text } from "../../../components/text";
import { gameToSlug } from "../../../lib/gameSlug";
import { topDropRates } from "../api/homepageStats";

export function StackedDecksPanel() {
  const { game } = useGameContext();

  return (
    <div className="rounded-xl border border-(--wc-border) bg-base-300 p-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Text
            size="xs"
            weight="semibold"
            uppercase
            className="tracking-wider text-info"
          >
            Stacked Decks
          </Text>
          <Heading as="h2" size="lg" className="text-(--wc-text-90)">
            Observed drop rates
          </Heading>
        </div>

        <ul className="flex flex-col divide-y divide-(--wc-border)">
          {topDropRates.map((entry) => (
            <li
              key={entry.cardName}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-(--wc-text-70)">
                {entry.cardName}
              </span>
              <span className="text-sm font-semibold text-success">
                {entry.rate}
              </span>
            </li>
          ))}
        </ul>

        <ButtonInternalLink
          to="/$game/stacked-decks"
          params={{ game: gameToSlug(game) }}
          className="flex items-center gap-2 rounded-lg border border-(--wc-accent-border) bg-(--wc-glow) px-4 py-2 text-sm font-medium text-(--wc-text-90) transition-colors hover:brightness-110"
        >
          View all drop rates →
        </ButtonInternalLink>
      </div>
    </div>
  );
}
