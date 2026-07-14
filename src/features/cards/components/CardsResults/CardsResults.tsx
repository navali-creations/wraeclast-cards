import type { Card } from "../../types";
import { CardsGrid } from "../CardsGrid/CardsGrid";

interface CardsResultsProps {
  cards: Card[];
  hasError: boolean;
  isLoading: boolean;
}

export function CardsResults({
  cards,
  hasError,
  isLoading,
}: CardsResultsProps) {
  return (
    <div className="space-y-3">
      <CardsGrid data={cards} hasError={hasError} isLoading={isLoading} />
    </div>
  );
}
