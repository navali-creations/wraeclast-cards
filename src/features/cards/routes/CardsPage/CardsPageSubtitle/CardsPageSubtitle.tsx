import { Text } from "../../../../../components/text";

interface CardsPageSubtitleProps {
  cardCount: number | undefined;
  leagueName: string;
}

export function CardsPageSubtitle({
  cardCount,
  leagueName,
}: CardsPageSubtitleProps) {
  if (cardCount === undefined) return null;

  return (
    <>
      <Text as="span" weight="semibold" className="text-(--wc-gold)">
        {cardCount.toLocaleString()}
      </Text>{" "}
      cards · {leagueName} league
    </>
  );
}
