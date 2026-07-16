import { useLeagueContext } from "../../../../../app/league-context";
import { Text } from "../../../../../components/text";
import { useCardsPageControlsContext } from "../CardsPageControlsContext";

export function CardsPageSubtitle() {
  const { selectedLeague } = useLeagueContext();
  const { cardCount } = useCardsPageControlsContext();

  if (cardCount === undefined) return null;

  return (
    <>
      <Text as="span" weight="semibold" className="text-(--wc-gold)">
        {cardCount.toLocaleString()}
      </Text>{" "}
      cards · {selectedLeague.name} league
    </>
  );
}
