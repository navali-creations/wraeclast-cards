import { Text } from "../../../../../components/text";

interface StackedDecksHeaderSubtitleProps {
  totalCount: number;
  leagueName: string;
}

export function StackedDecksHeaderSubtitle({
  totalCount,
  leagueName,
}: StackedDecksHeaderSubtitleProps) {
  return (
    <>
      <Text as="span" weight="semibold" className="text-(--wc-gold)">
        {totalCount.toLocaleString()}
      </Text>{" "}
      observations · {leagueName} league
    </>
  );
}
